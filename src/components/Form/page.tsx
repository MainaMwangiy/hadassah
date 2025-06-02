"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Plus, RefreshCw, Download, Upload, DollarSign } from "lucide-react"
import Form from "./form";
import Table from "./table";
import Modal from "./Modal";

import type { ModuleConfig, DataItem } from "../../config/products/types"
import { useApi } from "../../hooks/Apis"
import { useSnackbar } from "notistack"
import Loader from "../../hooks/Loader"

interface DataArray {
  id?: number
}

interface ModulePageProps {
  config: ModuleConfig
  showAddNew?: boolean
  rest?: DataArray
  showTotal?: boolean
  hideActionMenu?: boolean
}

const ModulePage: React.FC<ModulePageProps> = ({
  config,
  showAddNew = false,
  showTotal = false,
  hideActionMenu,
  rest,
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const { apiRequest } = useApi()
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const clientorganizationid = localStorage.getItem("clientorganizationid") || ""
  const [refreshCount, setRefreshCount] = useState(0)
  const [mode, setMode] = useState<"add" | "edit">("add")

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setIsFormOpen(true)
    setMode("edit")
  }

  const handleClose = () => {
    setIsFormOpen(false)
    setSelectedItem(null)
  }

  const getTotals = async () => {
    const { url = "", payload = {} } = config?.apiEndpoints?.total ?? {}
    const additionalParams = payload.hideProject ? {} : { projectid: rest?.id }
    const mandatoryParams = { clientorganizationid: clientorganizationid }
    const tempPayload = { ...payload, ...additionalParams }
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload })
    setTotal(response?.data?.[0]?.total || 0)
  }

  useEffect(() => {
    getTotals()
  }, [])

  const refreshData = async () => {
    setRefreshCount((prev) => prev + 1)
    await getTotals()
  }

  const handleExportExpenses = async () => {
    try {
      setLoading(true)
      const { url = "", payload = {} } = config?.apiEndpoints?.list ?? {}
      const additionalParams = !payload.hideProject ? {} : { projectid: rest?.id }
      const reqParams = { isExport: true, clientorganizationid: clientorganizationid }
      const tempPayload = { ...payload, ...additionalParams, ...reqParams }
      const response = await apiRequest({
        method: "POST",
        url: url,
        data: tempPayload,
        responseType: "blob",
        filename: config?.title,
      })
      if (!response) {
        enqueueSnackbar("Failed to export expenses. Please try again.", { variant: "error" })
        setLoading(false)
        return
      }
      const currentDate = new Date().toISOString().split("T")[0]
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.setAttribute("download", `${config?.title}${currentDate}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      setLoading(false)
    } catch (error) {
      enqueueSnackbar("Failed to export expenses. Please try again.", { variant: "error" })
      console.error("Error exporting expenses:", error)
    }
  }

  const ActionButton = ({
    onClick,
    icon,
    children,
    variant = "secondary",
    loading = false,
  }: {
    onClick: () => void
    icon: React.ReactNode
    children: React.ReactNode
    variant?: "primary" | "secondary" | "success" | "warning"
    loading?: boolean
  }) => {
    const variants = {
      primary: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-blue-500",
      success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
      warning: "bg-amber-600 hover:bg-amber-700 text-white focus:ring-orange-500",
    }

    return (
      <button
        onClick={onClick}
        disabled={loading}
        className={`
          inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium shadow-sm 
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:py-2 sm:text-sm
          ${variants[variant]}
        `}
      >
        {loading ? (
          <RefreshCw size={12} className="animate-spin sm:h-4 sm:w-4" />
        ) : (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span className="hidden sm:inline">{children}</span>
      </button>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div>
          {config.showTitle && (
            <h1 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">{config.title}</h1>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {showAddNew && (
            <ActionButton
              onClick={() => {
                setSelectedItem(null)
                setIsFormOpen(true)
                setMode("add")
              }}
              icon={<Plus size={12} className="sm:h-4 sm:w-4" />}
              variant="primary"
            >
              Add New
            </ActionButton>
          )}

          <ActionButton
            onClick={refreshData}
            icon={<RefreshCw size={12} className="sm:h-4 sm:w-4" />}
            variant="secondary"
          >
            Refresh
          </ActionButton>

          {config.isImport && (
            <ActionButton onClick={() => { }} icon={<Download size={12} className="sm:h-4 sm:w-4" />} variant="success">
              Import {config.title}
            </ActionButton>
          )}

          {config.isExport && (
            <ActionButton
              onClick={handleExportExpenses}
              icon={<Upload size={12} className="sm:h-4 sm:w-4" />}
              variant="warning"
              loading={loading}
            >
              Export {config.title}
            </ActionButton>
          )}
        </div>
      </div>

      {/* Total Display */}
      {(config.showTotal || showTotal) && (
        <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 sm:h-8 sm:w-8">
              <DollarSign className="h-3.5 w-3.5 text-green-600 dark:text-green-400 sm:h-4 sm:w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total {config.title}</p>
              <p className="text-base font-bold text-green-600 dark:text-green-400 sm:text-lg">
                KES {new Intl.NumberFormat("en-KE").format(total)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <Modal
            isOpen={isFormOpen}
            onClose={handleClose}
            title={selectedItem ? "Edit Item" : "Add Item"}
            config={config}
            size="lg"
          >
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
          <Table
            config={config}
            onEdit={handleEdit}
            hideActionMenu={hideActionMenu}
            refreshCount={refreshCount}
            {...rest}
          />
        </>
      )}
    </div>
  )
}

export default ModulePage
