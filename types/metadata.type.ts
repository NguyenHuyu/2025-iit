import { z } from 'zod'

const OpenGraphSchema = z.object({
    type: z.string().optional(),
    url: z.string().url().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    siteName: z.string().optional(),
    images: z.array(z.object({ url: z.string().url() })).optional(),
})

const TwitterSchema = z.object({
    card: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
    site: z.string().optional(),
    creator: z.string().optional(),
    images: z.array(z.string().url()).optional(),
})

export const PageMetadataSchema = z.object({
    id: z.string().uuid().optional(), // UUID tự động tạo
    slug: z.string().min(1, 'Slug không được để trống'),
    title: z.string().min(1, 'Title không được để trống'),
    description: z.string().min(1, 'Description không được để trống'),
    openGraph: OpenGraphSchema.optional(), // OG metadata là optional
    twitter: TwitterSchema.optional(), // Twitter metadata là optional
    userId: z.string().uuid(), // UUID của User
    createdAt: z.date().optional(), // Auto-generated
    updatedAt: z.date().optional(), // Auto-generated
})
