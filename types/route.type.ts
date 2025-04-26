import { Locale } from '@/i18n/i18n-config'
import { Category } from '@prisma/client'

export type RouteType = {
    id: string
    slug: string
    locale: Locale
}

export type SearchType = {
    isDraft: boolean | undefined
    page?: number
    size?: number
    filter?: string
    value?: string
    status?: string
    language?: string
    keyword?: string
    categories?: Category
}

/**
 * @interface InterfaceLayout
 * @param {React.ReactNode} children
 * @param {Promise<RouteType>} params
 */
export interface InterfaceLayout {
    children: React.ReactNode
    params: Promise<RouteType>
}

/**
 * @interface InterfacePage
 * @param {Promise<RouteType>} params
 * @param {Promise<SearchType>} searchParams
 */
export interface InterfacePage {
    params: Promise<RouteType>
    searchParams: Promise<SearchType>
}

export interface InterfaceModePage extends InterfacePage {
    searchParams: Promise<
        SearchType & {
            mode: 'edit' | 'read' | 'create'
        }
    >
}
