import { z } from 'zod'

export const NavbarSchema = z.object({
    key: z.number(),
    routeName: z.object({
        vi: z.string(),
        en: z.string(),
    }),
    linkUrl: z.string(),
    options: z.array(z.lazy((): z.ZodTypeAny => NavbarSchema)).optional(),
})

// Schema chính cho toàn bộ Navbar
export type Navbar = z.infer<typeof NavbarSchema>
