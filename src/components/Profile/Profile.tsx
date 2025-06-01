"use client"

import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useSnackbar } from "notistack"
import axios from "axios"
import { User, Lock, Upload, Save, X } from 'lucide-react'
import Security from "./Security"
import ConfirmationDialog from "../../hooks/ConfirmationDialog"
import utils from "../../utils"
import type { UserProfile } from "../../types"

const initialValues: UserProfile = {
    name: "",
    email: "",
    location: "",
}

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    location: Yup.string().required("Location is required"),
})

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState("account")
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const [isDragOver, setIsDragOver] = useState(false)

    // Get user data from localStorage
    const clientorganizationid = localStorage.getItem("clientorganizationid")
    const clientusers = localStorage.getItem("clientuser") || ""
    const user = JSON.parse(clientusers)
    const roleid = user?.roleid
    const storedUser = localStorage.getItem("clientuser")
    const clientUser = storedUser ? JSON.parse(storedUser) : {}
    const { image_url } = clientUser || {}
    const imageSrc = image_url || ""

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                setIsSubmitting(true)
                const data = {
                    ...values,
                    roleid: roleid,
                    clientorganizationid: clientorganizationid,
                    clientuserid: user?.clientuserid,
                }
                const url = `${utils.baseUrl}/api/auth/update/${user?.clientuserid}`
                await axios.post(url, data, {
                    headers: { "Content-Type": "application/json" },
                })
                enqueueSnackbar("Profile updated successfully", { variant: "success" })
            } catch (error) {
                console.error("Error updating user:", error)
                enqueueSnackbar("Profile update failed. Please try again.", { variant: "error" })
            } finally {
                setIsSubmitting(false)
            }
        },
    })

    useEffect(() => {
        if (clientUser) {
            formik.setValues({
                name: clientUser.name || "",
                email: clientUser.email || "",
                location: clientUser.location || "",
                roleid: clientUser.roleid || undefined,
            })
        }
    }, [])

    const handleSubmit = () => {
        if (formik.dirty) {
            setShowConfirmationDialog(true)
        } else {
            formik.submitForm()
        }
    }

    const onConfirm = () => {
        setShowConfirmationDialog(false)
        formik.submitForm()
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        // Handle file upload logic here
    }

    const TabButton = ({ id, label, icon }: { id: string; label: string; icon: React.ReactNode }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === id
                ? "border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300"
                }`}
        >
            {icon}
            {label}
        </button>
    )

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-4">
                        <TabButton id="account" label="Account" icon={<User size={18} />} />
                        <TabButton id="security" label="Security" icon={<Lock size={18} />} />
                    </div>
                </div>

                {/* Tab content */}
                <div className="p-6">
                    {activeTab === "account" && (
                        <div className="space-y-8">
                            <form onSubmit={formik.handleSubmit}>
                                {/* Profile Photo */}
                                <div className="mb-8">
                                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Profile Photo</h3>
                                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                                        {imageSrc ? (
                                            <img
                                                src={imageSrc || "/placeholder.svg"}
                                                alt="Profile"
                                                className="h-24 w-24 rounded-full object-cover"
                                                onError={(e) => {
                                                    ; (e.target as HTMLImageElement).src = "https://via.placeholder.com/96"
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500">
                                                <span className="text-2xl font-medium text-white">{clientUser.name?.charAt(0) || "U"}</span>
                                            </div>
                                        )}

                                        <div
                                            className={`
                        relative flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors sm:w-auto
                        ${isDragOver
                                                    ? "border-purple-400 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/10"
                                                    : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/30"
                                                }
                      `}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            <input type="file" className="absolute inset-0 h-full w-full opacity-0" accept="image/*" />
                                            <Upload className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" />
                                            <p className="mb-1 text-sm font-medium text-purple-600 dark:text-purple-400">
                                                <span>Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800KB)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Information */}
                                <div>
                                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Account Information</h3>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Full Name
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                value={formik.values.name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={`block w-full rounded-lg border ${formik.touched.name && formik.errors.name
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    } px-4 py-2.5 text-sm shadow-sm`}
                                            />
                                            {formik.touched.name && formik.errors.name && (
                                                <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={`block w-full rounded-lg border ${formik.touched.email && formik.errors.email
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    } px-4 py-2.5 text-sm shadow-sm`}
                                            />
                                            {formik.touched.email && formik.errors.email && (
                                                <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="location"
                                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Location
                                            </label>
                                            <input
                                                id="location"
                                                name="location"
                                                type="text"
                                                value={formik.values.location}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={`block w-full rounded-lg border ${formik.touched.location && formik.errors.location
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    } px-4 py-2.5 text-sm shadow-sm`}
                                            />
                                            {formik.touched.location && formik.errors.location && (
                                                <p className="mt-2 text-sm text-red-600">{formik.errors.location}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => formik.resetForm()}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <X size={16} />
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-purple-700 dark:hover:bg-purple-600"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg
                                                        className="h-4 w-4 animate-spin"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    <span>Saving...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={16} />
                                                    <span>Save changes</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Deactivate Account */}
                            <div className="mt-10 rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
                                <h3 className="text-lg font-medium text-red-800 dark:text-red-400">Deactivate Account</h3>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                    Once you deactivate your account, there is no going back. Please be certain.
                                </p>
                                <div className="mt-4 flex items-center">
                                    <input
                                        id="deactivate-confirm"
                                        name="deactivate-confirm"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    <label
                                        htmlFor="deactivate-confirm"
                                        className="ml-2 block text-sm font-medium text-red-700 dark:text-red-300"
                                    >
                                        I confirm my account deactivation
                                    </label>
                                </div>
                                <button className="mt-4 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600">
                                    Deactivate Account
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && <Security />}
                </div>
            </div>

            <ConfirmationDialog
                open={showConfirmationDialog || showCancelConfirmation}
                title={showConfirmationDialog ? "Confirm Submission" : "Unsaved Changes"}
                content={
                    showConfirmationDialog
                        ? "Are you sure you want to submit these details?"
                        : "You have unsaved changes. Are you sure you want to discard them?"
                }
                onCancel={() =>
                    showConfirmationDialog ? setShowConfirmationDialog(false) : setShowCancelConfirmation(false)
                }
                onConfirm={onConfirm}
                confirmDiscard={showConfirmationDialog ? "Submit" : "Discard"}
            />
        </div>
    )
}

export default Profile
