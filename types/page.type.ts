import { z } from 'zod'

export const LanguageEnum = z.enum(['VI', 'EN'])

export const PageMetadataTranslationSchema = z.object({
    id: z.string().optional(),
    language: LanguageEnum,
    title: z.string().min(3),
    description: z.string().optional(),
})

export const PageContentTranslationSchema = z.object({
    id: z.string().optional(),
    language: LanguageEnum,
    content: z.string().min(10),
})

export const OpenGraphMetadataSchema = z.object({
    id: z.string().optional(),
    language: LanguageEnum,
    title: z.string().min(3),
    description: z.string().optional(),
    images: z.union([z.string(), z.instanceof(File)]).optional(),
})

export const TwitterMetadataSchema = z.object({
    id: z.string().optional(),
    language: LanguageEnum,
    title: z.string().min(3),
    description: z.string().optional(),
    images: z.union([z.string(), z.instanceof(File)]).optional(),
})

export const PagesSchema = z.object({
    slug: z.string(),
    title: z.string().min(3),

    metadataBase: z.string().optional(),
    applicationName: z.string().optional(),
    author: z.string().optional(),
    keywords: z.string().optional(),

    appleIcon: z.union([z.string(), z.instanceof(File)]).optional(),
    shortcutIcon: z.union([z.string(), z.instanceof(File)]).optional(),
    favicon: z.union([z.string(), z.instanceof(File)]).optional(),

    metadata: z.array(PageMetadataTranslationSchema),
    openGraph: z.array(OpenGraphMetadataSchema),
    twitter: z.array(TwitterMetadataSchema),
    pageContent: z.array(PageContentTranslationSchema).optional(),
    isSystem: z.boolean().optional(),
    isPageContent: z.boolean().optional(),
})

export const UserPagePermissionSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    pageId: z.string().uuid(),
    canCreate: z.boolean(),
    canRead: z.boolean(),
    canUpdate: z.boolean(),
    canDelete: z.boolean(),
})

export type Pages = z.infer<typeof PagesSchema> & {
    id?: string
}
