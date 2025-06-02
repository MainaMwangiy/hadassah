"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface SubmissionContextType {
    submissionState: boolean
    setSubmissionState: (state: boolean) => void
}

const SubmissionContext = createContext<SubmissionContextType | null>(null)

export const useSubmissionContext = () => {
    const context = useContext(SubmissionContext)
    if (context === null) {
        throw new Error("useSubmissionContext must be used within a SubmissionProvider")
    }
    return context
}

interface SubmissionProviderProps {
    children: ReactNode
}

export const SubmissionProvider: React.FC<SubmissionProviderProps> = ({ children }) => {
    const [submissionState, setSubmissionState] = useState(false)

    return (
        <SubmissionContext.Provider value={{ submissionState, setSubmissionState }}>{children}</SubmissionContext.Provider>
    )
}
