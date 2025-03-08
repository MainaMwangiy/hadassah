import React, { useEffect, useState } from "react";
import { ModuleConfig } from "../../config/products/types";
import { useApi } from "../../hooks/Apis";
import ActionMenu from "../../hooks/ActionMenu";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";
import Pagination from "./pagination";
import Loader from "../../hooks/Loader";
import { useSubmissionContext } from "./context";
import SearchInput from "../../hooks/SearchInput";
import dayjs from "dayjs";
import utils from "../../utils";

interface GenericTableProps {
  config: ModuleConfig;
  onEdit: (item: any) => void;
  params?: Record<string, any>;
  id?: number;
  hideActionMenu?: boolean;
  refreshCount?: number;
}

const Table: React.FC<GenericTableProps> = ({ config, onEdit, params, hideActionMenu, refreshCount, ...rest }) => {
  const key = utils.getKeyField(config);
  const keyField = `${key}id`;
  let localKey = `${key}s`;
  const { apiRequest } = useApi();
  const [data, setData] = useState<any[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const { submissionState } = useSubmissionContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
  const updateLocal = config?.updateLocal;

  const handleSearch = (value: string) => {
    setCurrentPage(1); // Reset to first page when searching
    fetchData(value);
  };

  const handleClearSearch = () => {
    setCurrentPage(1); // Reset to first page when clearing search
    setSearchTerm('');
    fetchData(''); // Fetch data without search term
  };

  const fetchData = async (searchValue?: string) => {
    setLoading(true);
    const { url='', payload = {} } = config.apiEndpoints.list || {};
    const additionalParams = payload.hideProject ? {} : { projectid: rest?.id };
    const mandatoryParams = { clientorganizationid: clientorganizationid };
    const tempPayload = {
      ...payload,
      ...params,
      page: currentPage,
      pageSize: itemsPerPage,
      searchTerm: searchValue || searchTerm,
      ...additionalParams,
      // ...mandatoryParams
    };
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload });
    setData(response?.data || []);
    setTotalItems(response?.totalItems || 0);
    if (updateLocal) {
      localStorage.setItem(localKey, JSON.stringify(response?.data))
    }
    setLoading(false);
  };

  const confirmDeleteExpense = async () => {
    setLoading(true);
    const { payload } = config.apiEndpoints.delete;
    const tempParams = { ...payload }
    if (deleteId !== null) {
      const data = {
        ...tempParams,
        [keyField]: deleteId,
      };
      await apiRequest({ method: "POST", url: `${config.apiEndpoints.delete.url}/${deleteId}`, data: data });
      fetchData();
      setShowDeleteDialog(false);
      setDeleteId(null);
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchData();
  }, [config, currentPage, submissionState, refreshCount]);

  const renderCellContent = (field: any, item: any) => {
    if (field.type === 'date' && item[field.name]) {
      return dayjs(item[field.name]).format(utils.dateFormat);
    } else if (field.type === "json" && item[field.name]) {
      return (
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(item[field.name], null, 2)}
        </pre>
      );
    } else if (field.convertValue) {
      return field.convertValue(item[field.name]);
    } else if (field.render) {
      return field.render(item[field.name], item);
    } else {
      return item[field.name];
    }
  };

  return (
    <>       
     {config?.addSearch && <SearchInput 
        placeholder={`Search for ${config?.title}`} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />}
      <div className="overflow-x-auto">
        {loading ? <Loader /> :
          <table className="min-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {config.fields.filter(field => !field?.hide).map((field) => (
                  <th
                    key={field.name}
                    className="px-4 py-2 text-left text-sm font-semibold"
                    style={{ minWidth: field.width || "150px" }}
                  >
                    {field.label}
                  </th>
                ))}
                <th className="px-4 py-2 text-left text-sm font-semibold" style={{ minWidth: "80px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any) => (
                <tr key={item.id || item[keyField]} className="border-b border-gray-200 dark:border-gray-700">
                  {config.fields.filter(field => !field?.hide).map((field) => (
                    <td
                      key={field.name}
                      className={`px-4 py-2 text-sm ${field.getCustomClass ? field.getCustomClass(item) : ''}`}
                    >
                      {renderCellContent(field, item)}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-sm">
                    <ActionMenu onEdit={() => onEdit(item)} onDelete={() => handleDeleteClick(item[keyField] || 0)} config={config} hideActionMenu={true} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        {showDeleteDialog && (
          <ConfirmationDialog
            open={showDeleteDialog}
            title="Confirm Deletion"
            content={`Are you sure you want to delete this ${config.title}?`}
            onCancel={() => setShowDeleteDialog(false)}
            onConfirm={confirmDeleteExpense}
            confirmDiscard="Delete"
          />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Table;
