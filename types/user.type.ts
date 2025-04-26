import { z } from 'zod'

export const UserSchema = z.object({
    id: z.string().optional(),
    email: z
        .string()
        .email()
        .min(4, { message: 'Email is too short' })
        .max(255, { message: 'Email is too long' }),
    name: z.string().optional(),
    password: z
        .string()
        .min(6)
        .max(255)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/),
    role: z.enum(['ADMIN', 'USER']),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export type User = z.infer<typeof UserSchema>

export const LoginUserSchema = UserSchema.pick({ email: true, password: true })

export type LoginUser = Pick<User, 'email' | 'password'>
