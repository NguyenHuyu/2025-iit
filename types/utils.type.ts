import { Category, Language, Status } from '@prisma/client'

export type SearchType = {
    keyword?: string
    limit?: number
    page?: number
    isDraft?: boolean | undefined
    isImportant?: boolean
    language?: Language
    status?: Status
    categories?: Category[]
}
