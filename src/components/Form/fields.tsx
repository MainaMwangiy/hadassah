"use client"

import type React from "react"
import { useState } from "react"
import { useField } from "formik"
import { Eye, EyeOff, Upload, Calendar, ChevronDown } from "lucide-react"
import Autocomplete from "../../hooks/Autocomplete"
import type { FieldConfig } from "../../config/products/types"

const FormField: React.FC<{ fieldConfig: FieldConfig }> = ({ fieldConfig }) => {
  const [field, meta, helpers] = useField(fieldConfig.name)
  const [showPassword, setShowPassword] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)

  const hasError = meta.touched && meta.error

  const handleAutocompleteChange = (event: React.SyntheticEvent, newValue: any | null) => {
    helpers.setValue(newValue ? newValue.value : "")
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    try {
      // const response = await axios.post("api/image-upload-url", formData, config);
      // helpers.setValue(response.data.url);
      setUploadProgress(0)
    } catch (error) {
      console.error("Error uploading image:", error)
    }
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
    const files = e.dataTransfer.files
    if (files.length > 0) {
      // Handle file upload
    }
  }

  const baseInputClass = `
    block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 
    placeholder-gray-500 shadow-sm transition-colors duration-200
    focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20
    disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
    dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400
    dark:focus:border-purple-400 dark:focus:ring-purple-400/20 dark:disabled:bg-gray-700
    sm:py-2.5
  `

  const errorInputClass = hasError
    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-600 dark:focus:border-red-400 dark:focus:ring-red-400/20"
    : ""

  const renderField = () => {
    switch (fieldConfig.type) {
      case "text":
      case "number":
      case "string":
        return (
          <input
            {...field}
            type={fieldConfig.type === "number" ? "number" : "text"}
            className={`${baseInputClass} ${errorInputClass}`}
            placeholder={`Enter ${fieldConfig.label.toLowerCase()}`}
          />
        )

      case "textarea":
        return (
          <textarea
            {...field}
            rows={4}
            className={`${baseInputClass} ${errorInputClass} resize-none`}
            placeholder={`Enter ${fieldConfig.label.toLowerCase()}`}
          />
        )

      case "select":
        return (
          <div className="relative">
            <select {...field} className={`${baseInputClass} ${errorInputClass} appearance-none pr-10`}>
              <option value="">Select {fieldConfig.label}</option>
              {fieldConfig.options?.map((option: any) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )

      case "password":
        return (
          <div className="relative">
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              className={`${baseInputClass} ${errorInputClass} pr-10`}
              placeholder={`Enter ${fieldConfig.label.toLowerCase()}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        )

      case "date":
        return (
          <div className="relative">
            <input {...field} type="date" className={`${baseInputClass} ${errorInputClass} pr-10`} />
            <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )

      case "json":
        return (
          <div className="space-y-2">
            <textarea
              {...field}
              className={`${baseInputClass} ${errorInputClass} font-mono text-xs resize-none`}
              placeholder={`Enter ${fieldConfig.label} in JSON format`}
              rows={6}
              value={
                typeof field.value === "object" && field.value !== null
                  ? JSON.stringify(field.value, null, 2)
                  : field.value || ""
              }
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  helpers.setValue(parsed)
                } catch {
                  helpers.setValue(e.target.value)
                }
              }}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">Enter valid JSON format</p>
          </div>
        )

      case "image":
        return (
          <div className="space-y-4">
            <div
              className={`
                relative rounded-lg border-2 border-dashed p-4 text-center transition-colors sm:p-6
                ${isDragOver
                  ? "border-purple-400 bg-purple-50 dark:bg-purple-900/10"
                  : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <div className="space-y-2">
                <Upload className="mx-auto h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
                <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                  <span className="font-medium text-purple-600 dark:text-purple-400">Click to upload</span> or drag and
                  drop
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                  <span className="text-gray-600 dark:text-gray-400">{uploadProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )

      case "autocomplete":
        return (
          <div className="relative">
            <Autocomplete
              label={fieldConfig.label}
              value={field.value || ""}
              onChange={handleAutocompleteChange}
              options={
                fieldConfig.options
                  ? Array.isArray(fieldConfig.options) &&
                    typeof fieldConfig.options[0] === "string"
                    ? fieldConfig.options.map((option: string) => ({
                      value: option,
                      label: option
                    }))
                    : (fieldConfig.options as any[])
                  : []
              }
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {fieldConfig.label}
        {fieldConfig.required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {renderField()}
      {hasError && (
        <p className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
          <span className="h-1 w-1 rounded-full bg-red-500" />
          {meta.error}
        </p>
      )}
    </div>
  )
}

export default FormField
