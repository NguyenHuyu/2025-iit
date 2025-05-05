import { ApiResponse, PaginatedData } from '@/services/types/response'
import { DefaultSearchParams } from '@/services/types/search'

export type BaseOperations<T> = {
    getList?: (
        searchParams?: DefaultSearchParams,
        filters?: Record<string, string[]>
    ) => Promise<ApiResponse<PaginatedData<T>>>

    getNotPaginatedData?: (
        searchParams?: DefaultSearchParams,
        filters?: Record<string, string[]>
    ) => Promise<ApiResponse<T[]>>

    getDetail?: (id: number | string, tags?: string[]) => Promise<ApiResponse<T>>
    getById?: (id: number | string, tags?: string[]) => Promise<ApiResponse<T>>
    create?: (data: T) => Promise<ApiResponse<T>>
    update?: (id: number | string, data: T) => Promise<ApiResponse<T>>
    delete?: (id: number | string) => Promise<ApiResponse<void>>
}

// Custom operations interface that can be extended for specific services
export interface CustomOperations<R = undefined> {
    [key: string]: (...args: R[]) => Promise<ApiResponse<R>>
}

// Combined type that includes both base and custom operations
export type MethodOperations<T, R = undefined> = BaseOperations<T> & Partial<CustomOperations<R>>

// Helper type for creating strongly-typed custom operations
export type CustomMethod<P extends any[], R> = (...args: P) => Promise<ApiResponse<R>>
