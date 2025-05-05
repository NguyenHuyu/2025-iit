export interface DefaultSearchParams {
    page?: number
    size?: number
    sort?: string
    [key: string]: any

    // Add any other default search params here
    filter?: string
    value?: string
}

/**
 * Validates and sanitizes a numeric parameter
 * @param value The value to validate
 * @param defaultValue Default value if invalid
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @returns Sanitized numeric value
 */
function sanitizeNumericParam(
    value: string | string[] | undefined,
    defaultValue: number,
    min: number,
    max: number
): number {
    // If value is undefined, return default
    if (value === undefined) return defaultValue

    // If value is an array, take the first element
    const strValue = Array.isArray(value) ? value[0] : value

    // Check if the string contains only digits
    if (!/^\d+$/.test(strValue)) return defaultValue

    // Convert to number and validate range
    const numValue = Number(strValue)

    // Check if it's a valid number within range
    if (isNaN(numValue) || numValue < min || numValue > max) {
        return defaultValue
    }

    return numValue
}

/**
 * Validates and sanitizes a string parameter
 * @param value The value to validate
 * @param allowedValues Array of allowed values
 * @param defaultValue Default value if invalid
 * @returns Sanitized string value
 */
function sanitizeStringParam(
    value: string | string[] | undefined,
    allowedValues: string[],
    defaultValue: string
): string {
    // If value is undefined, return default
    if (value === undefined) return defaultValue

    // If value is an array, take the first element
    const strValue = Array.isArray(value) ? value[0] : value

    // Check if the value is in the allowed list
    if (allowedValues.includes(strValue)) {
        return strValue
    }

    return defaultValue
}

/**
 * Parses and validates URL search parameters for filtering
 * @param searchParams The raw search params from Next.js
 * @returns Validated search params and filters
 */
export function parseSearchParams(searchParams: Record<string, string | string[]>) {
    // Initialize default values
    const params: DefaultSearchParams = {
        page: 1,
        size: 10,
    }

    // Initialize filters object
    const filters: Record<string, string[]> = {}

    // Sanitize page parameter (min=1, max=1000)
    params.page = sanitizeNumericParam(searchParams.page, 1, 1, 1000)

    // Sanitize size parameter (min=1, max=100)
    params.size = sanitizeNumericParam(searchParams.size, 10, 1, 100)

    // Sanitize sort parameter (only allow specific values)
    if (searchParams.sort) {
        const allowedSortValues = ['asc', 'desc', 'newest', 'oldest', 'price_asc', 'price_desc']
        params.sort = sanitizeStringParam(searchParams.sort, allowedSortValues, 'asc')
    }

    // Handle filter and value pairs with validation
    const filterValues = searchParams.filter
    const valueValues = searchParams.value

    // Check if both filter and value exist
    if (filterValues !== undefined && valueValues !== undefined) {
        // Convert to arrays if they're not already
        const filters_arr = Array.isArray(filterValues) ? filterValues : [filterValues]
        const values_arr = Array.isArray(valueValues) ? valueValues : [valueValues]

        // Process each filter-value pair
        const filterCount = Math.min(filters_arr.length, values_arr.length, 10) // Limit to 10 filters

        for (let i = 0; i < filterCount; i++) {
            const filter = filters_arr[i]
            const value = values_arr[i]

            // Validate filter name (only allow alphanumeric and underscore)
            if (!/^[a-zA-Z0-9_]+$/.test(filter)) {
                continue
            }

            // Validate filter value (prevent script injection but preserve Unicode)
            const sanitizedValue = sanitizeFilterValue(value)
            if (!sanitizedValue) {
                continue
            }

            // Initialize array for this filter if it doesn't exist
            if (!filters[filter]) {
                filters[filter] = []
            }

            // Add the value to the filter
            filters[filter].push(sanitizedValue)
        }
    }
    return { params, filters }
}

/**
 * Sanitizes a filter value to prevent script injection and other attacks
 * while preserving Unicode characters
 * @param value The filter value to sanitize
 * @returns Sanitized value or null if invalid
 */
function sanitizeFilterValue(value: string): string | null {
    // Reject empty values
    if (!value || value.trim() === '') return null

    // Reject values that are too long
    if (value.length > 100) return null

    // Only reject potentially dangerous characters, but allow Unicode
    // This regex only blocks specific dangerous characters, not all non-alphanumeric
    if (/[<>(){}[\]\\]/.test(value)) return null

    // Basic HTML entity encoding for specific dangerous characters
    // but preserve all other characters including Unicode
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

/**
 * Builds a URL search string from params and filters
 * ALWAYS includes page=1 by default
 */
export function buildSearchUrl(
    params: DefaultSearchParams = {},
    filters?: Record<string, string[]>
): string {
    const searchParams = new URLSearchParams()

    // Add pagination params with defaults - ALWAYS use page 1 as default
    searchParams.append('page', (params.page || 1).toString())
    searchParams.append('size', (params.size || 10).toString())

    // Add sort if it exists and is valid
    if (params.sort && typeof params.sort === 'string') {
        searchParams.append('sort', params.sort)
    }

    // Add any other params with validation
    Object.entries(params).forEach(([key, value]) => {
        if (!['page', 'size', 'sort'].includes(key) && value !== undefined) {
            // Only allow alphanumeric keys
            if (!/^[a-zA-Z0-9_]+$/.test(key)) return

            // Convert value to string and limit length
            const strValue = String(value).substring(0, 100)
            searchParams.append(key, strValue)
        }
    })

    // Add filters if they exist
    if (filters) {
        Object.entries(filters).forEach(([filter, values]) => {
            // Only allow alphanumeric filter names
            if (!/^[a-zA-Z0-9_]+$/.test(filter)) return

            values.forEach((value) => {
                // Limit value length but preserve Unicode
                const safeValue = String(value).substring(0, 100)
                searchParams.append('filter', filter)
                searchParams.append('value', safeValue)
            })
        })
    }

    return `?${searchParams.toString()}`
}

/**
 * Builds a search string for API calls
 */
export function searchWithFilters(
    params: DefaultSearchParams = {},
    filters?: Record<string, string[]>
): string {
    // Ensure params has default values
    const paramsWithDefaults = {
        page: 1,
        size: 10,
        ...params,
    }

    const searchParams = new URLSearchParams()

    // Add pagination params with validation
    if (paramsWithDefaults.page !== undefined) {
        const page = Math.max(1, Math.min(1000, paramsWithDefaults.page))
        searchParams.append('page', page.toString())
    }

    if (paramsWithDefaults.size !== undefined) {
        const size = Math.max(1, Math.min(100, paramsWithDefaults.size))
        searchParams.append('size', size.toString())
    }

    if (paramsWithDefaults.sort && typeof paramsWithDefaults.sort === 'string') {
        // Limit sort parameter length
        searchParams.append('sort', paramsWithDefaults.sort.substring(0, 20))
    }

    // Add any other params with validation
    Object.entries(paramsWithDefaults).forEach(([key, value]) => {
        if (!['page', 'size', 'sort'].includes(key) && value !== undefined) {
            // Only allow alphanumeric keys
            if (!/^[a-zA-Z0-9_]+$/.test(key)) return

            // Convert value to string and limit length
            const strValue = String(value).substring(0, 100)

            searchParams.append(key, strValue)
        }
    })

    // Add filters if they exist
    if (filters) {
        Object.entries(filters).forEach(([filter, values]) => {
            // Only allow alphanumeric filter names
            if (!/^[a-zA-Z0-9_]+$/.test(filter)) return

            values.forEach((value) => {
                // Limit value length
                const safeValue = String(value).substring(0, 100)
                if (!searchParams.has('filter')) {
                    searchParams.append('filter', filter)
                }
                if (!searchParams.has('value')) {
                    searchParams.append('value', safeValue)
                }
            })
        })
    }

    const searchString = searchParams.toString()
    return searchString ? `?${searchString}` : ''
}
