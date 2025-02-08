import React, { useState } from "react";
import { FieldConfig } from "../../config/products/types";
import { useField } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Autocomplete, TextField } from "@mui/material";

interface FormFieldProps {
  fieldConfig: FieldConfig;
}

const FormField: React.FC<any> = ({ fieldConfig }) => {
  const [field, meta, helpers] = useField(fieldConfig.name);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<any[]>(fieldConfig.options || []);

  const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string) => {
    setInputValue(newInputValue);
    if (fieldConfig.options) {
      const filteredOptions = fieldConfig.options.filter((option: any) =>
        option.label.toLowerCase().includes(newInputValue.toLowerCase())
      );
      setOptions(filteredOptions);
    } else {
      setOptions([]);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
    };
    try {
      // const response = await axios.post("api/image-upload-url", formData, config);
      // helpers.setValue(response.data.url);  // Assuming the API returns the URL of the uploaded image
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const renderField = () => {
    const inputBaseClass = "w-full px-3 py-2 border rounded text-gray-900 dark:text-white";
    switch (fieldConfig.type) {
      case "text":
      case "number":
      case "string":
      case "textarea":
        return (
          <input
            {...field}
            type={fieldConfig.type}
            className={`${inputBaseClass} bg-white dark:bg-gray-800`}
            placeholder={fieldConfig.label}
          />
        );
      case "select":
        return (
          <select {...field} className={`${inputBaseClass} bg-white dark:bg-gray-800`}>
            <option value="">Select {fieldConfig.label}</option>
            {fieldConfig.options?.map((option: any) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "password":
        return (
          <div className="relative">
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              className={`${inputBaseClass} bg-white dark:bg-gray-800 pr-10`}
              placeholder={fieldConfig.label}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        );
      case "date":
        return (
          <input
            {...field}
            type="date"
            className={`${inputBaseClass} bg-white dark:bg-gray-800`}
            placeholder={fieldConfig.label}
          />
        );
      case "json":
        return (
          <textarea
            {...field}
            className="w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-800"
            placeholder={`Enter ${fieldConfig.label} in JSON format`}
            rows={6}
            value={typeof field.value === "object" && field.value !== null ? JSON.stringify(field.value, null, 2) : field.value || ""}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                helpers.setValue(parsed);
              } catch {
                helpers.setValue(e.target.value);
              }
            }}
          />
        );
      case "image":
        return (
          <div className="flex flex-col">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-2"
            />
            {uploadProgress > 0 && (
              <progress value={uploadProgress} max="100">{uploadProgress}%</progress>
            )}
          </div>
        );
      case "autocomplete":
        return (
          <div className="relative">
            <Autocomplete
              {...field}
              freeSolo
              options={options}
              getOptionLabel={(option) => option.label || ""}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              noOptionsText="No data available"
              onChange={(event, newValue: any) => {
                helpers.setValue(newValue ? newValue?.value : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={fieldConfig.label}
                  variant="standard"
                  error={meta.touched && Boolean(meta.error)}
                  helperText={meta.touched && meta.error}
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    className:
                      "bg-white dark:bg-gray-800 dark:text-white",
                  }}
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    className: "text-gray-900 dark:text-white",
                  }}
                  className="!border !border-gray-300 dark:!border-white"
                />
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="m-4">
      <label className="text-gray-900 dark:text-white">{fieldConfig.label}</label>
      {renderField()}
      {meta.touched && meta.error && <div className="text-red-500">{meta.error}</div>}
    </div>
  );
};

export default FormField;
