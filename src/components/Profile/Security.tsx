import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import utils from '../../utils';

const Security: React.FC = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const clientorganizationid = localStorage.getItem("clientorganizationid");

    const formik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required('Current password is required'),
            newPassword: Yup.string().required('New password is required'),
            confirmNewPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .required('Please confirm your new password'),
        }),
        onSubmit: async (values) => {
            try {
                const url = `${utils.baseUrl}/api/auth/update-password`;
                const payload = {
                    clientuserid: localStorage.getItem('clientuserid'),
                    password: values.currentPassword,
                    newpassword: values.newPassword,
                    clientorganizationid: clientorganizationid
                };

                await axios.post(url, payload, {
                    headers: { "Content-Type": "application/json" },
                });
                enqueueSnackbar('Password updated successfully!', { variant: 'success' });
                formik.resetForm();
            } catch (error) {
                enqueueSnackbar('Password update failed. Please try again.', { variant: 'error' });
            }
        },
    });

    return (
        <div className="mt-8">
            {/* Security Tab */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold">Change Password</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        {/* Current Password */}
                        <div className="mb-4 relative">
                            <label className="text-gray-700 dark:text-gray-300">Current Password</label>
                            <div className="flex">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    {...formik.getFieldProps('currentPassword')}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-9"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? (
                                        <AiOutlineEyeInvisible className="text-gray-600 dark:text-gray-400" />
                                    ) : (
                                        <AiOutlineEye className="text-gray-600 dark:text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {formik.touched.currentPassword && formik.errors.currentPassword ? (
                                <div className="text-red-500 text-sm">{formik.errors.currentPassword}</div>
                            ) : null}
                        </div>

                        {/* New Password */}
                        <div className="mb-4 relative">
                            <label className="text-gray-700 dark:text-gray-300">New Password</label>
                            <div className="flex">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    {...formik.getFieldProps('newPassword')}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-9"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <AiOutlineEyeInvisible className="text-gray-600 dark:text-gray-400" />
                                    ) : (
                                        <AiOutlineEye className="text-gray-600 dark:text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {formik.touched.newPassword && formik.errors.newPassword ? (
                                <div className="text-red-500 text-sm">{formik.errors.newPassword}</div>
                            ) : null}
                        </div>

                        {/* Confirm New Password */}
                        <div className="mb-4 relative">
                            <label className="text-gray-700 dark:text-gray-300">Confirm New Password</label>
                            <div className="flex">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    {...formik.getFieldProps('confirmNewPassword')}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-9"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <AiOutlineEyeInvisible className="text-gray-600 dark:text-gray-400" />
                                    ) : (
                                        <AiOutlineEye className="text-gray-600 dark:text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? (
                                <div className="text-red-500 text-sm">{formik.errors.confirmNewPassword}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 mt-4">
                        <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded-lg">
                            Save Changes
                        </button>
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                            onClick={() => formik.resetForm()}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Security;
