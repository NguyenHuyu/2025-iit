type Content<T> = {
    content: T
    totalElements: number
    currentPage: number
    size: number
    totalPages: number
}

export type InterfaceStatusResult = {
    statusCode: number
    message: string
}

/**
 * @interface InterfaceResult<T>
 * @param {number} statusCode
 * @param {Content<T>} data
 */
export type InterfaceResults<T> = InterfaceStatusResult & {
    data: Content<T[]>
}

/**
 * @interface InterfaceResult<T>
 * @param {number} statusCode
 * @param {Content<T>} data
 */
export type InterfaceResult<T> = InterfaceStatusResult & {
    data?: T
}
