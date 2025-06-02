"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Edit, Trash2, Search, X } from "lucide-react"
import type { ModuleConfig } from "../../config/products/types"
import { useApi } from "../../hooks/Apis"
import ConfirmationDialog from "../../hooks/ConfirmationDialog"
import Pagination from "./pagination"
import Loader from "../../hooks/Loader"
import { useSubmissionContext } from "./context"
import dayjs from "dayjs"
import utils from "../../utils"

interface GenericTableProps {
  config: ModuleConfig
  onEdit: (item: any) => void
  params?: Record<string, any>
  id?: number
  hideActionMenu?: boolean
  refreshCount?: number
}

const Table: React.FC<GenericTableProps> = ({ config, onEdit, params, hideActionMenu, refreshCount, ...rest }) => {
  const key = utils.getKeyField(config)
  const keyField = `${key}id`
  const localKey = `${key}s`
  const { apiRequest } = useApi()
  const [data, setData] = useState<any[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const { submissionState } = useSubmissionContext()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const updateLocal = config?.updateLocal

  const handleSearch = (value: string) => {
    setCurrentPage(1)
    fetchData(value)
  }

  const handleClearSearch = async () => {
    setSearchTerm("")
    setCurrentPage(1)
  }

  const fetchData = async (searchValue?: string) => {
    setLoading(true);
    const { url = '', payload = {} } = config.apiEndpoints.list || {};
    const additionalParams = payload.hideProject ? {} : { projectid: rest?.id };
    const tempPayload = {
      ...payload,
      ...params,
      page: currentPage,
      pageSize: itemsPerPage,
      searchTerm: searchValue || searchTerm,
      ...additionalParams,
    };
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload });
    setData(response?.data || []);
    setTotalItems(response?.totalItems || 0);
    const custom = localKey.toLowerCase() === 'products';
    if (updateLocal && !custom) {
      localStorage.setItem(localKey, JSON.stringify(response?.data))
    }
    setLoading(false)
  }

  const confirmDeleteExpense = async () => {
    setLoading(true)
    const { payload } = config.apiEndpoints.delete
    const tempParams = { ...payload }
    if (deleteId !== null) {
      const data = {
        ...tempParams,
        [keyField]: deleteId,
      }
      await apiRequest({ method: "POST", url: `${config.apiEndpoints.delete.url}/${deleteId}`, data: data })
      fetchData()
      setShowDeleteDialog(false)
      setDeleteId(null)
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: number) => {
    setDeleteId(id)
    setShowDeleteDialog(true)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const fetchProductsData = async () => {
    setLoading(true)
    const url = `${utils.baseUrl}/api/products/list`
    const tempPayload = { page: 1, pageSize: 100 }
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload })
    localStorage.setItem("products", JSON.stringify(response?.data))
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    fetchProductsData();
  }, [config, currentPage, submissionState, refreshCount, searchTerm])

  const renderCellContent = (field: any, item: any) => {
    if (field.type === "date" && item[field.name]) {
      return dayjs(item[field.name]).format(utils.dateFormat)
    } else if (field.type === "json" && item[field.name]) {
      return (
        <pre className="max-w-xs overflow-hidden text-ellipsis whitespace-pre-wrap rounded bg-gray-100 p-2 text-xs dark:bg-gray-700">
          {JSON.stringify(item[field.name], null, 2)}
        </pre>
      )
    } else if (field.convertValue) {
      return field.convertValue(item[field.name])
    } else if (field.render) {
      return field.render(item[field.name], item)
    } else {
      return item[field.name]
    }
  }

  const ActionButton = ({
    onClick,
    icon,
    variant = "ghost",
  }: { onClick: () => void; icon: React.ReactNode; variant?: "ghost" | "danger" }) => {
    const variants = {
      ghost: "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700",
      danger: "text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-300 dark:hover:bg-red-900/20",
    }

    return (
      <button onClick={onClick} className={`rounded-lg p-2 transition-colors duration-200 ${variants[variant]}`}>
        {icon}
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      {config?.addSearch && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${config?.title}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-10 py-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-purple-400"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => handleSearch(searchTerm)}
            className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {loading ? (
          <div className="p-8">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {config.fields
                    .filter((field) => !field?.hide)
                    .map((field) => (
                      <th
                        key={field.name}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                        style={{ minWidth: field.width || "150px" }}
                      >
                        {field.label}
                      </th>
                    ))}
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={config.fields.filter((field) => !field?.hide).length + 1}
                      className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  data.map((item: any) => (
                    <tr
                      key={item.id || item[keyField]}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      {config.fields
                        .filter((field) => !field?.hide)
                        .map((field) => (
                          <td
                            key={field.name}
                            className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${field.getCustomClass ? field.getCustomClass(item) : ""
                              }`}
                          >
                            {renderCellContent(field, item)}
                          </td>
                        ))}
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-1">
                          <ActionButton onClick={() => onEdit(item)} icon={<Edit size={16} />} variant="ghost" />
                          <ActionButton
                            onClick={() => handleDeleteClick(item[keyField] || 0)}
                            icon={<Trash2 size={16} />}
                            variant="danger"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      {/* Delete Confirmation */}
      {showDeleteDialog && (
        <ConfirmationDialog
          open={showDeleteDialog}
          title="Confirm Deletion"
          content={`Are you sure you want to delete this ${config.title}? This action cannot be undone.`}
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={confirmDeleteExpense}
          confirmDiscard="Delete"
        />
      )}
    </div>
  )
}

export default Table
