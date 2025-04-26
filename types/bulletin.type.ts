import { z } from 'zod'

export const CategoryEnum = z.enum([
    'EVENTS',
    'BUSINESS',
    'ANNOUNCEMENTS',
    'PUBLICATIONS',
    'COURSES',
    'SEMINARS',
    'NEWS',
    'BULLETINS',
    'PRODUCTS',
    'PROJECTS',
    'OTHERS',
    'ACADEMICS',
])

export const LanguageEnum = z.enum(['VI', 'EN'])

export const StatusEnum = z.enum(['Published', 'Achieved'])

export const BulletinSchema = z.object({
    id: z.string().optional(),
    category: CategoryEnum,

    updatedAt: z.date().optional(),
    createdAt: z.date().optional(),

    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),

    slug: z.string().min(1, 'Slug is required'),
    thumbnails: z.union([z.string(), z.instanceof(File)]),
    body: z.string(),

    language: LanguageEnum,

    tags: z.array(z.string()).optional(),
    isImportant: z.boolean(),
    isDraft: z.boolean(),
    status: StatusEnum,
})

export type Bulletin = z.infer<typeof BulletinSchema>

export type Category = z.infer<typeof CategoryEnum>
