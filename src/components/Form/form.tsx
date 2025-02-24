import React, { useEffect, useState } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import FormField from "./fields";
import Modal from "./Modal";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";
import { ModuleConfig } from "../../config/products/types";
import { useApi } from "../../hooks/Apis";
import { constants } from "../../utils/constants";
import { useSubmissionContext } from "./context";
import utils from "../../utils";
import { useSnackbar } from "notistack";

interface GenericFormProps {
  config: ModuleConfig;
  onClose: () => void;
  isOpen: boolean;
  initialValues?: Record<string, any>;
}
type Mode = 'edit' | 'add' | null;
interface ProductOption {
  productid: number;
  name: string;
}

type CustomPayload = {
  productid?: number;
  name?: string;
  [key: string]: any;
};
const Form: React.FC<GenericFormProps & { mode: Mode, [key: string]: any }> = ({ config, onClose, isOpen, initialValues = {}, mode, ...rest }) => {
  const isUpdate = mode === 'edit';
  const limitCreate = config?.limit && !isUpdate;
  const { apiRequest } = useApi();
  const [fieldsToShow, setFieldsToShow] = useState(config.fields.filter(field => field.form !== false));
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const { setSubmissionState } = useSubmissionContext();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object(
      config.fields.reduce<Record<string, Yup.AnySchema>>((schema, field) => {
        if (field.required) {
          schema[field.name] = Yup.string().required(`${field.label} is required`);
        }
        return schema;
      }, {})
    ),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const staticValues = { ...values };
      let localData: Record<string, ProductOption[]> = {};
      config.fields.forEach(field => {
        if (field.listType) {
          const listCombo = `${field.listType}s`;
          const tempData = localStorage.getItem(listCombo);
          localData[field.listType] = JSON.parse(tempData || '[]');
        }
      });
      const customPayload: CustomPayload = {};
      let productInfo: any;
      if (config.customSale) {
        productInfo = localData.product?.find(
          (item: ProductOption) => item.productid === parseInt(isUpdate ? staticValues.productid : staticValues.name)
        );
        if (productInfo) {
          customPayload.productid = productInfo.productid;
          customPayload.name = productInfo.name;
        }
      }
      // Sales Validations
      const buyingPrice = Number(productInfo?.price) || 0;
      if (Number(staticValues?.sellingprice) < buyingPrice) {
        enqueueSnackbar("Selling Price cannot be less than Buying Price", { variant: "error" });
        setShowCancelConfirmation(false);
        onClose();
        setSubmitting(false);
        return;
      }
      
      if (productInfo && staticValues.quantity) {
        const availableStock = productInfo?.quantity || 0;
        if (Number(staticValues.quantity) > Number(availableStock)) {
          enqueueSnackbar(`You only have ${availableStock} Products in stock. Please restock first to make a sale of ${Number(staticValues.quantity)}!`, { variant: "error" });
          setShowCancelConfirmation(false);
          onClose();
          setSubmitting(false);     
          return;
        }
      }
      
      const lookupKey = `${config.customKey?.toLowerCase() || config.keyField.toLowerCase()}id`;
      const id = staticValues[lookupKey] || customPayload[lookupKey];
      const endpoint = mode === 'edit' ? config.apiEndpoints.update : config.apiEndpoints.create;
      const url = mode === 'edit' && id ? `${endpoint.url}/${id}` : endpoint.url;
      const defaultPayload = endpoint.payload || {};
      const requestData = { ...defaultPayload, ...staticValues, ...customPayload };
      
      try {
        await apiRequest({ method: "POST", url, data: requestData });
        setSubmissionState(true);
        onClose();
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    formik.setValues(formik.initialValues);
  }, [initialValues]);

  const { dirty } = formik;
  const handleSubmit = () => {
    if (limitCreate) {
      enqueueSnackbar("You cannot add new project. Please contact support", { variant: "error" });
      onClose();
      return;
    }
    if (dirty) {
      setShowConfirmationDialog(true);
    } else {
      formik.submitForm();
    }
  };
  const onConfirmSubmit = () => {
    setShowConfirmationDialog(false);
    formik.submitForm();
  };

  const onCancel = () => {
    if (dirty) {
      setShowCancelConfirmation(true);
    } else {
      onClose();
    }
  };

  const confirmCancel = () => {
    onClose();
    setShowCancelConfirmation(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setSubmissionState(false);
    }
  }, [isOpen, setSubmissionState]);

  useEffect(() => {
    const updatedFields = fieldsToShow.map(field => {
      const listCombo = `${field?.listType}s` || '';
      const tempData = localStorage.getItem(listCombo);
      const localData = JSON.parse(tempData || '[]');
      const optionsData = localData.map((item: ProductOption) => ({
        label: item.name,
        value: item[`${field.listType}id` as keyof ProductOption]
      }));
      if (field.type === "autocomplete") {
        return { ...field, options: optionsData };
      }
      return field;
    });
    setFieldsToShow(updatedFields);
  }, [isOpen]);
  useEffect(() => {
    const calculateTotalPrice = () => {
      const quantity = formik.values.quantity;
      const sellingPrice = formik.values.sellingprice;
      if (quantity && sellingPrice) {
        const total = Number(quantity) * Number(sellingPrice);
        formik.setFieldValue('totalprice', total.toFixed(2));
      }
    };

    calculateTotalPrice();
  }, [formik.values.quantity, formik.values.sellingprice, formik.setFieldValue]);

  const formContent = (
    <FormikProvider value={formik}>
      <form onSubmit={e => e.preventDefault()}>
        {fieldsToShow
          .filter(fieldConfig => fieldConfig?.isSuperAdmin !== false)
          .map(fieldConfig => (
            <FormField key={fieldConfig.name} fieldConfig={fieldConfig} />
          ))}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition duration-300"
          >
            {isUpdate ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isUpdate ? `Edit ${config.title}` : `Add ${config.title}`} {...rest}>
      <>
        {formContent}
        {(showConfirmationDialog || showCancelConfirmation) && (
          <ConfirmationDialog
            open={showConfirmationDialog || showCancelConfirmation}
            title={showConfirmationDialog ? "Confirm Submission" : "Unsaved Changes"}
            content={showConfirmationDialog ? constants.FORM_SUBMIT : constants.FORM_DISCARD}
            onCancel={() => {
              if (showConfirmationDialog) {
                setShowConfirmationDialog(false);
              } else {
                setShowCancelConfirmation(false);
              }
            }}
            onConfirm={showConfirmationDialog ? onConfirmSubmit : confirmCancel}
            confirmDiscard={showConfirmationDialog ? "Submit" : "Discard"}
          />
        )}
      </>
    </Modal>
  );

};

export default Form;
