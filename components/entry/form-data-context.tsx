'use client'

import { createContext, useContext, ReactNode } from 'react'

// Define the type for the data fetching functions
export interface DataFetchingFunctions {
    [key: string]: (...args: any[]) => Promise<any>
}

// Create the context
const FormDataContext = createContext<DataFetchingFunctions | null>(null)

// Create the provider component
export function FormDataProvider({
    children,
    fetchFunctions,
}: {
    children: ReactNode
    fetchFunctions: DataFetchingFunctions
}) {
    return <FormDataContext.Provider value={fetchFunctions}>{children}</FormDataContext.Provider>
}

// Create a hook to use the context
export function useFormData() {
    const context = useContext(FormDataContext)
    if (!context) {
        throw new Error('useFormData must be used within a FormDataProvider')
    }
    return context
}

// Create a hook to get a specific fetching function
export function useFormDataFetcher<T = any>(key: string) {
    const fetchFunctions = useFormData()
    const fetchFunction = fetchFunctions[key]

    if (!fetchFunction) {
        throw new Error(`Fetch function with key "${key}" not found in FormDataProvider`)
    }

    return fetchFunction as (...args: any[]) => Promise<T>
}
