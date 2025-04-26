import { z } from 'zod'

export const TypeEnum = z.enum(['IMAGE', 'VIDEO'])

export const StatusEnum = z.enum(['Published', 'Achieved'])

export const BannerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    url: z.union([z.string(), z.instanceof(File)]),
    size: z.number().min(1, 'Size is required'),
    type: TypeEnum,
    status: StatusEnum,
    updatedAt: z.date().optional(),
    createdAt: z.date().optional(),
})

export type Banner = z.infer<typeof BannerSchema> & {
    id: string
}

export type Type = z.infer<typeof TypeEnum>

export type Status = z.infer<typeof StatusEnum>
