import React, { useEffect, useState } from 'react';
import Security from './Security';
import { FaUser, FaLock, FaUserCircle } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import utils from '../../utils';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from "yup";
import { UserProfile } from '../../types';
import ConfirmationDialog from '../../hooks/ConfirmationDialog';

const initialValues: UserProfile = {
    name: '',
    email: '',
    location: '',
}

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    location: Yup.string().required("Location is required")
});

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const clientorganizationid = localStorage.getItem("clientorganizationid");
    const clientusers = localStorage.getItem("clientuser") || "";
    const user = JSON.parse(clientusers);
    const roleid = user?.roleid;
    const storedUser = localStorage.getItem('clientuser');
    const clientUser = storedUser ? JSON.parse(storedUser) : {};
    const { image_url } = clientUser || {};
    const imageSrc = image_url ? image_url : '';
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const data = {
                    ...values,
                    roleid: roleid,
                    clientorganizationid: clientorganizationid,
                    clientuserid: user?.clientuserid
                }
                const url = `${utils.baseUrl}/api/auth/update/${user?.clientuserid}`;
                await axios.post(url, data, {
                    headers: { "Content-Type": "application/json" },
                });
                enqueueSnackbar("User updated successfully.", { variant: "success" });
            } catch (error) {
                console.error('Error updating user:', error);
                enqueueSnackbar("User update failed. Please try again.", { variant: "error" });
            }
        },
    });

    useEffect(() => {
        if (clientUser) {
            formik.setValues({
                name: clientUser.name || '',
                email: clientUser.email || '',
                location: clientUser.location || '',
                roleid: clientUser.roleid || undefined
            });
        }
    }, []);

    const handleSubmit = () => {
        if (formik.dirty) {
            setShowConfirmationDialog(true);
        } else {
            formik.submitForm();
        }
    };

    const onConfirm = () => {
        setShowConfirmationDialog(false);
        formik.submitForm();
    };

    return (
        <div className="p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
            <div className="container mx-auto p-2">
                {/* Tabs */}
                <div className="flex justify-start space-x-4 mt-4">
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`flex items-center space-x-2 ${activeTab === 'account'
                            ? 'text-pink-500 dark:text-pink-300 border-b-2 border-pink-500'
                            : 'text-gray-600 dark:text-gray-400 border-b-2 border-transparent'
                            } p-2`}
                    >
                        <FaUser />
                        <span>Account</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center space-x-2 ${activeTab === 'security'
                            ? 'text-pink-500 dark:text-pink-300 border-b-2 border-pink-500'
                            : 'text-gray-600 dark:text-gray-400 border-b-2 border-transparent'
                            } p-2`}
                    >
                        <FaLock />
                        <span>Security</span>
                    </button>
                </div>

                {/* Tab content */}
                {activeTab === 'account' && (
                    <div className="mt-8 space-y-6">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                <div className="flex items-center space-x-6">
                                    {imageSrc ? (
                                        <img src={imageSrc} alt="Profile" className="w-14 h-14 rounded-full" />
                                    ) : (
                                        <FaUserCircle className="text-gray-500" size={96} />
                                    )}
                                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">Upload New Photo</button>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Allowed JPG, GIF, or PNG. Max size of 800K</p>

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-gray-700 dark:text-gray-300">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="mt-1 p-2 w-full rounded-lg border dark:bg-gray-700 dark:text-gray-300"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.name && formik.errors.name ? (
                                            <div className="text-red-500">{formik.errors.name}</div>
                                        ) : null}
                                    </div>
                                    <div>
                                        <label className="text-gray-700 dark:text-gray-300">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="mt-1 p-2 w-full rounded-lg border dark:bg-gray-700 dark:text-gray-300"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.email && formik.errors.email ? (
                                            <div className="text-red-500">{formik.errors.email}</div>
                                        ) : null}
                                    </div>
                                    <div>
                                        <label className="text-gray-700 dark:text-gray-300">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="mt-1 p-2 w-full rounded-lg border dark:bg-gray-700 dark:text-gray-300"
                                            value={formik.values.location}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.location && formik.errors.location ? (
                                            <div className="text-red-500">{formik.errors.location}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <button
                                    className="bg-pink-500 text-white px-4 py-2 rounded-lg mt-4"
                                    type='button'
                                    onClick={handleSubmit}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>

                        <ConfirmationDialog
                            open={showConfirmationDialog || showCancelConfirmation}
                            title={showConfirmationDialog ? "Confirm Submission" : "Unsaved Changes"}
                            content={showConfirmationDialog ? "Are you sure you want to submit these details?" : "You have unsaved changes. Are you sure you want to discard them?"}
                            onCancel={() => showConfirmationDialog ? setShowConfirmationDialog(false) : setShowCancelConfirmation(false)}
                            onConfirm={onConfirm}
                            confirmDiscard={showConfirmationDialog ? "Submit" : "Discard"}
                        />
                        {/* Deactivate Account */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold mb-4">Deactivate Account</h2>
                            <label className="flex items-center mb-4 space-x-2">
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-pink-600" />
                                <span className="text-gray-700 dark:text-gray-300">I confirm my account deactivation</span>
                            </label>

                            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out">
                                Deactivate Account
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && <Security />}
            </div>
        </div >
    );
};

export default Profile;
