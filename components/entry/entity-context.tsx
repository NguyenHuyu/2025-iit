'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    useMemo,
    type ReactNode,
} from 'react'
import type { BaseEntity } from './types'
import type { BaseOperations } from '@/services/types/base'

const CrudContext = createContext<unknown>(null)

// Cache configuration
interface CacheConfig {
    maxSize: number
    ttl: number // time to live in milliseconds
}

interface CacheEntry<T> {
    data: T
    timestamp: number
}

export interface EntityContextProps<T extends BaseEntity> {
    selectedId: string | number | undefined
    setSelectedId: (id: string | number) => void
    isCreateDialogOpen: boolean
    setIsCreateDialogOpen: (open: boolean) => void
    isDetailDialogOpen: boolean
    setIsDetailDialogOpen: (open: boolean) => void
    isDeleteDialogOpen: boolean
    setIsDeleteDialogOpen: (open: boolean) => void

    operations: BaseOperations<T>

    // optional
    isOptionalDialogOpen: boolean
    setIsOptionalDialogOpen: (open: boolean) => void

    // type of the render update form or show form
    renderName: 'UPDATE' | 'SHOW'
    setRenderName: (name: 'UPDATE' | 'SHOW') => void

    isLoading: boolean

    errors?: {
        statusCode: number
        message: string
    }

    //
    setShow: (show: boolean) => void
    show: boolean
    setData: (data: T | undefined) => void
    setError: (error: string | null) => void
    data: T | undefined
    error: string | null
    refreshData: () => void

    // New methods for better control
    clearCache: () => void
    prefetchData: (id: string | number) => Promise<void>
}

interface CrudProviderProps<T extends BaseEntity> {
    children: ReactNode
    operations: BaseOperations<T>
    cacheTag?: string
    cacheDuration?: number
    cacheConfig?: Partial<CacheConfig>
}

// Default cache configuration
const DEFAULT_CACHE_CONFIG: CacheConfig = {
    maxSize: 100, // Maximum number of items in cache
    ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
}

export function EntityProvider<T extends BaseEntity>({
    children,
    operations,
    cacheTag = 'entity',
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    cacheConfig = {},
}: CrudProviderProps<T>) {
    // Merge default cache config with provided config
    const finalCacheConfig = useMemo(
        () => ({
            ...DEFAULT_CACHE_CONFIG,
            ...cacheConfig,
            ttl: cacheDuration || DEFAULT_CACHE_CONFIG.ttl,
        }),
        [cacheDuration, cacheConfig]
    )

    // State management
    const [selectedId, setSelectedId] = useState<string | number>()
    const [isOptionalDialogOpen, setIsOptionalDialogOpen] = useState(false)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [renderName, setRenderName] = useState<'UPDATE' | 'SHOW'>('SHOW')
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<T>()
    const [error, setError] = useState<string | null>(null)
    const [show, setShow] = useState(false)

    // Enhanced cache with timestamps for TTL
    const cacheRef = useRef<Map<string | number, CacheEntry<T>>>(new Map())

    // Track if we're currently in a fetch operation to prevent duplicate loading states
    const isFetchingRef = useRef<boolean>(false)

    // Cache management functions
    const getCacheKey = useCallback((id: string | number) => `${cacheTag}-${id}`, [cacheTag])

    const getFromCache = useCallback(
        (id: string | number): T | undefined => {
            const entry = cacheRef.current.get(id)

            if (!entry) return undefined

            // Check if cache entry has expired
            if (Date.now() - entry.timestamp > finalCacheConfig.ttl) {
                cacheRef.current.delete(id)
                return undefined
            }

            return entry.data
        },
        [finalCacheConfig.ttl]
    )

    const setInCache = useCallback(
        (id: string | number, value: T) => {
            // If cache is at max size, remove oldest entry
            if (cacheRef.current.size >= finalCacheConfig.maxSize) {
                const oldestKey = cacheRef.current.keys().next().value
                if (oldestKey) {
                    cacheRef.current.delete(oldestKey)
                }
            }

            cacheRef.current.set(id, {
                data: value,
                timestamp: Date.now(),
            })
        },
        [finalCacheConfig.maxSize]
    )

    const clearCache = useCallback(() => {
        cacheRef.current.clear()
    }, [])

    // Simplified fetch function with better loading state management
    const fetchData = useCallback(async () => {
        if (!selectedId || !show) return

        // Check cache first
        const cachedData = getFromCache(selectedId)
        if (cachedData) {
            setData(cachedData)
            return
        }

        // Only set loading state if we're not already fetching
        if (!isFetchingRef.current) {
            setIsLoading(true)
            isFetchingRef.current = true
        }

        setError(null)

        try {
            console.log(`Fetching data from server for ${getCacheKey(selectedId)}`)

            // Call API with cache tag
            if (!operations.getById) throw new Error('getById not defined')
            const result = await operations.getById(selectedId as number, [getCacheKey(selectedId)])

            if (result.statusCode === 200 && result.data) {
                // Save to cache
                setInCache(selectedId, result.data)
                setData(result.data)
            } else {
                setError(result.message || 'Failed to fetch item')
                setData(undefined)
            }
        } catch (err) {
            setError('An error occurred while fetching data')
            setData(undefined)
            console.error(err)
        } finally {
            // Reset loading state
            setIsLoading(false)
            isFetchingRef.current = false
        }
    }, [selectedId, show, getFromCache, getCacheKey, operations, setInCache])

    // Silent fetch that never triggers loading state
    const fetchDataSilent = useCallback(async () => {
        if (!selectedId) return

        setError(null)

        try {
            console.log(`Silently fetching data from server for ${getCacheKey(selectedId)}`)

            // Call API with cache tag
            if (!operations.getById) throw new Error('getById not defined')
            const result = await operations.getById(selectedId as number, [getCacheKey(selectedId)])

            if (result.statusCode === 200 && result.data) {
                // Save to cache
                setInCache(selectedId, result.data)
                setData(result.data)
            } else {
                setError(result.message || 'Failed to fetch item')
                // Don't reset data on error to avoid UI flicker
            }
        } catch (err) {
            setError('An error occurred while fetching data')
            // Don't reset data on error to avoid UI flicker
            console.error(err)
        }
    }, [selectedId, getCacheKey, operations, setInCache])

    // Prefetch data for a specific ID without setting it as selected
    const prefetchData = useCallback(
        async (id: string | number) => {
            if (!id) return

            // Check if already in cache
            if (getFromCache(id)) return

            try {
                if (!operations.getById) throw new Error('getDetail not defined')
                const result = await operations.getById(id as number, [getCacheKey(id)])

                if (result.statusCode === 200 && result.data) {
                    setInCache(id, result.data)
                }
            } catch (err) {
                console.error('Prefetch error:', err)
            }
        },
        [getCacheKey, getFromCache, operations, setInCache]
    )

    // Effect to fetch data when selectedId or show changes
    useEffect(() => {
        if (show && selectedId) {
            // Reset data when ID changes to avoid showing stale data
            setData(undefined)
            fetchData()
        }
    }, [fetchData, show, selectedId])

    // Clear data when dialog is closed
    useEffect(() => {
        if (!show) {
            setData(undefined)
        }
    }, [show])

    // Refresh data by clearing cache and fetching silently
    const refreshData = useCallback(() => {
        if (!selectedId) return

        // Only remove this specific item from cache
        cacheRef.current.delete(selectedId)

        // Use fetchDataSilent which guarantees no loading state will be shown
        fetchDataSilent()
    }, [selectedId, fetchDataSilent])

    // Enhanced setSelectedId to avoid unnecessary state updates
    const handleSetSelectedId = useCallback(
        (id: string | number) => {
            if (id !== selectedId) {
                setData(undefined) // Reset data when ID changes
                setSelectedId(id)
            }
        },
        [selectedId]
    )

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo<EntityContextProps<T>>(
        () => ({
            selectedId,
            setSelectedId: handleSetSelectedId,
            isCreateDialogOpen,
            setIsCreateDialogOpen,
            isDetailDialogOpen,
            setIsDetailDialogOpen,
            isDeleteDialogOpen,
            setIsDeleteDialogOpen,
            operations,
            isOptionalDialogOpen,
            setIsOptionalDialogOpen,
            renderName,
            setRenderName,
            isLoading,
            setShow,
            show,
            setData,
            setError,
            data,
            error,
            refreshData,
            clearCache,
            prefetchData,
        }),
        [
            selectedId,
            handleSetSelectedId,
            isCreateDialogOpen,
            isDetailDialogOpen,
            isDeleteDialogOpen,
            operations,
            isOptionalDialogOpen,
            renderName,
            isLoading,
            show,
            data,
            error,
            refreshData,
            clearCache,
            prefetchData,
        ]
    )

    return <CrudContext.Provider value={contextValue}>{children}</CrudContext.Provider>
}

export function useContextHooks<T extends BaseEntity>(): EntityContextProps<T> {
    const context = useContext(CrudContext)
    if (!context) {
        throw new Error('useContextHooks must be used within an EntityProvider')
    }
    return context as EntityContextProps<T>
}
