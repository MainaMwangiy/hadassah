import React, { useEffect, useState } from "react";
import Form from "./form";
import Table from "./table";
import Modal from "./Modal";

import { ModuleConfig, DataItem } from "../../config/products/types";
import { AiOutlineDownload, AiOutlinePlus, AiOutlineReload, AiOutlineUpload } from "react-icons/ai";
import { useApi } from "../../hooks/Apis";
import { useSnackbar } from "notistack";
import Loader from "../../hooks/Loader";

interface DataArray { id?: number; }

interface ModulePageProps {
  config: ModuleConfig;
  showAddNew?: boolean;
  rest?: DataArray;
  showTotal?: boolean;
  hideActionMenu?: boolean;
}

const ModulePage: React.FC<ModulePageProps> = ({ config, showAddNew = false, showTotal = false, hideActionMenu, rest }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { apiRequest } = useApi();
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
  const [refreshCount, setRefreshCount] = useState(0);

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const getTotals = async () => {
    const { url = '', payload = {} } = config?.apiEndpoints?.total ?? {};
    const additionalParams = payload.hideProject ? {} : { projectid: rest?.id };
    const mandatoryParams = { clientorganizationid: clientorganizationid };
    const tempPayload = { ...payload, ...additionalParams };
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload });
    setTotal(response?.data?.[0]?.total || 0);
  }

  useEffect(() => {
    getTotals();
  }, [])

  const refreshData = async () => {
    setRefreshCount(prev => prev + 1);
    await getTotals();
  };

  const handleExportExpenses = async () => {
    try {
      setLoading(true);
      const { url = '', payload = {} } = config?.apiEndpoints?.list ?? {};
      const additionalParams = !payload.hideProject ? {} : { projectid: rest?.id };
      const reqParams = { isExport: true, clientorganizationid: clientorganizationid };
      const tempPayload = { ...payload, ...additionalParams, ...reqParams };
      const response = await apiRequest({ method: "POST", url: url, data: tempPayload, responseType: 'blob', filename: config?.title });
      if(!response) {
        enqueueSnackbar("Failed to export expenses. Please try again.", { variant: "error" });
        setLoading(false);
        return;
      }
      const currentDate = new Date().toISOString().split('T')[0];
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${config?.title}${currentDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Failed to export expenses. Please try again.", { variant: "error" });
      console.error('Error exporting expenses:', error);
    }
  };

  const mode = selectedItem ? "edit" : "add";
  return (
    <div>
      <div className="flex flex-row items-center w-full space-x-2 mb-4">
        {config.showTitle && <h1>{config.title}</h1>}
        {showAddNew && (
          <button
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-2 rounded-lg shadow-md flex items-center"
            onClick={() => {
              setSelectedItem(null);
              setIsFormOpen(true);
            }}>
            <AiOutlinePlus className="text-lg md:mr-1" />
            <span className="hidden md:inline text-sm">Add New</span>
          </button>
        )}
        <button
          className="bg-teal-600 hover:bg-teal-700 transition text-white px-3 py-2 rounded-lg shadow-md flex items-center"
          onClick={refreshData}
        >
          <AiOutlineReload className="text-lg md:mr-1" />
          <span className="hidden md:inline text-sm">Refresh</span>
        </button>
        {config.isImport && <>
          <button
            className="bg-green-600 hover:bg-green-700 transition text-white px-3 py-2 rounded-lg shadow-md flex items-center"
          // onClick={handleImportExpenses}
          >
            <AiOutlineDownload className="text-lg md:mr-1" />
            <span className="hidden md:inline text-sm">Import {config.title}</span>
          </button>
        </>}

        {config.isExport && <>
          <button
            className="bg-gray-300 hover:bg-gray-400 transition text-black px-3 py-2 rounded-lg shadow-md flex items-center"
            onClick={handleExportExpenses}
          >
            < AiOutlineUpload className="text-lg md:mr-1" />
            <span className="hidden md:inline text-sm">Export {config.title}</span>
          </button>
        </>}
      </div>

      <div className="flex flex-row items-center w-full space-x-2 mb-4">
        {(config.showTotal || showTotal) && <>
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-1 rounded-lg shadow-md">
            <p className="font-semibold text-base mr-2">{`Total ${config.title}: `}</p>
            <p className="font-bold text-lg text-red-600 dark:text-red-400">KES {total}</p>
          </div>
        </>}
      </div>
      {loading ? <Loader /> :
        <>
          <Modal isOpen={isFormOpen} onClose={handleClose} title={selectedItem ? "Edit Item" : "Add Item"} config={config}>
            <Form
              config={config}
              onClose={handleClose}
              isOpen={isFormOpen}
              initialValues={selectedItem || {}}
              mode={mode}
              onDataUpdated={refreshData}
              {...rest}
            />
          </Modal>
          <Table config={config} onEdit={handleEdit} hideActionMenu={hideActionMenu} refreshCount={refreshCount} {...rest} />
        </>
      }
    </div>
  );
};

export default ModulePage;
