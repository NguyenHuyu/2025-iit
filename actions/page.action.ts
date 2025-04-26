'use server'

import { PageService } from '@/services/page.service'
import { Pages } from '@/types/page.type'
import { Language } from '@prisma/client'
import { Status } from '@reflet/http'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export const createPage = async (data: Omit<Pages, 'id'>) => {
    const result = await PageService.createPage(data)
    const language = (await cookies()).get('language')?.value

    if (result.statusCode === Status.Created) {
        revalidatePath('/admin/page')
        revalidatePath('/admin/page/create')
        revalidatePath(`/${language}`)
        revalidatePath(`/${language}${result.data.slug}`)
    }
    return result
}

export const updatePage = async (id: string, data: Pages) => {
    const result = await PageService.updatePage(id, data)
    const language = (await cookies()).get('language')?.value

    if (result.statusCode === Status.Ok) {
        revalidatePath('/admin/page')
        revalidatePath(`/admin/page/${id}`)
        revalidatePath(`/${language}`)
        revalidatePath(`/${language}${result.data.slug}`)
    }
    return result
}

export const deletePage = async (id: string) => {
    const result = await PageService.deletePage(id)
    if (result.statusCode === Status.Ok) {
        revalidatePath('/admin/page')
        revalidatePath(`/admin/page/${id}`)
    }
    return result
}

export const getPageBySlugAndLanguage = async (slug: string, language: Language) => {
    return PageService.getPageBySlugAndLanguage(slug, language)
}
