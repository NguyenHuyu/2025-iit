export type ApiPaginatedResponse<T> = {
    content: T[]
    totalElements: number
    page: number
    size: number
    totalPages: number
}

//new

// Generic response type
export type ApiResponse<T = undefined> = {
    statusCode: number
    message: string
    data?: T
}

export type PaginatedData<T> = {
    content: T[]
} & PaginationMeta

// Pagination metadata type
export type PaginationMeta = {
    totalPages: number
    totalElements: number
    size: number
    page: number
    //   sort: Array<{ property: string; direction: string }>;
    numberOfElements: number
}
