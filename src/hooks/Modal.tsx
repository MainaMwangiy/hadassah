import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import utils from "../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ConfirmationDialog from "./ConfirmationDialog";
import { UsersProps } from "../types";

interface AuthProps {
  clientorganizationid: string;
  name: string;
}

// Define the validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("First Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  location: Yup.string().required("Location is required"),
  status: Yup.string().required("Status is required"),
  role: Yup.string().required("Role is required"),
  password: Yup.string().required("Password is required"),
  clientorganizationid: Yup.string().required(
    "Client Organization is required"
  ),
});

interface AddUserModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  user?: UsersProps | null;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  showModal,
  setShowModal,
  user
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [clientOrganizations, setClientOrganizations] = useState<AuthProps[]>([]);
  const clientusers = localStorage.getItem("clientuser") || "";
  const roles = JSON.parse(clientusers);

  // Define the initial values for Formik form
  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    location: user?.location || "",
    status: user?.status || "",
    role: user?.role || 0,
    password: "",
    roleid: user?.roleid || 0,
    clientorganizationid: user?.clientorganizationid || "",
    clientuserid: user?.clientuserid || ""
  };


  useEffect(() => {
    const orgs = localStorage.getItem("clientorganizations");
    if (orgs) {
      setClientOrganizations(JSON.parse(orgs));
    }
  }, []);

  const formik = useFormik<{
    name: string;
    email: string;
    phoneNumber: string;
    location: string;
    status: string;
    role: string | number;
    password: string;
    roleid: number;
    clientorganizationid: string;
    clientuserid: string;
  }>({
    initialValues: {
      ...initialValues,
      clientuserid: user?.clientuserid?.toString() || "",
    },
    validationSchema,
    onSubmit: async values => {
      try {
        let url = '';
        if (user) {
          if (user.clientuserid !== undefined) {
            url = `${utils.baseUrl}/api/auth/update/${user.clientuserid.toString()}`;
            values.clientuserid = user.clientuserid.toString();
          } else {
            console.error("clientuserid is undefined.");
            return;
          }
        } else {
          url = `${utils.baseUrl}/api/auth/create`;
        }
        const roleid = utils.getRolesId(values.role as string);
        if (roleid) {
          values.roleid = roleid;
        }
        await axios.post(
          url,
          { values },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        formik.resetForm();
        enqueueSnackbar("User Creation successful!", { variant: "success" });
        navigate("/users");
      } catch (error) {
        enqueueSnackbar("User Creation failed. Please try again.", {
          variant: "error",
        });
      }
      setShowModal(false);
    },
  });

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

  const onCancel = () => {
    if (formik.dirty) {
      setShowCancelConfirmation(true);
    } else {
      setShowModal(false);
      formik.resetForm();
    }
  };

  const confirmCancel = () => {
    setShowModal(false);
    formik.resetForm();
    setShowCancelConfirmation(false);
  };

  const allowedOrganizationIds = roles.clientorganizationids;
  const filteredOrganizations =
    roles.roleid === 1
      ? clientOrganizations
      : clientOrganizations.filter(
        orgs => orgs.clientorganizationid === allowedOrganizationIds
      );

  return (
    <div>
      {/* Button to open the modal */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300"
      >
        Add User
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Add New User
            </h2>

            {/* Form */}
            <form >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.phoneNumber}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Location
                  </label>
                  <input
                    name="location"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.location && formik.errors.location && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.location}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.status}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Role
                  </label>
                  <select
                    name="role"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select</option>
                    {roles.roleid === 1 && (
                      <option value="Superadmin">Superadmin</option>
                    )}

                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                  {formik.touched.role && formik.errors.role && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.role}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Password
                  </label>
                  <div className="relative w-full">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 pr-10"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="text-gray-600 dark:text-gray-400" />
                      ) : (
                        <AiOutlineEye className="text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>
                {/* Client Organization Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Organization
                  </label>
                  <select
                    name="clientorganizationid"
                    className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.clientorganizationid}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select an organization</option>
                    {filteredOrganizations?.map(org => (
                      <option
                        key={org.clientorganizationid}
                        value={org.clientorganizationid}
                      >
                        {org.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.clientorganizationid &&
                    formik.errors.clientorganizationid && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.clientorganizationid}
                      </div>
                    )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 px-4 py-2 border rounded-md dark:text-gray-300 dark:border-gray-600"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
                >

                  {user ? "Update User" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmationDialog
        open={showConfirmationDialog || showCancelConfirmation}
        title={showConfirmationDialog ? "Confirm Submission" : "Unsaved Changes"}
        content={showConfirmationDialog ? "Are you sure you want to submit these details?" : "You have unsaved changes. Are you sure you want to discard them?"}
        onCancel={() => showConfirmationDialog ? setShowConfirmationDialog(false) : setShowCancelConfirmation(false)}
        onConfirm={showConfirmationDialog ? onConfirm : confirmCancel}
        confirmDiscard={showConfirmationDialog ? "Submit" : "Discard"}
      />
    </div>
  );
};

export default AddUserModal;
