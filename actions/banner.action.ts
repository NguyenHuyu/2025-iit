'use server'

import { BannerService } from '@/services/banner.service'
import { Banner } from '@/types/banner.type'
import { Status } from '@reflet/http'
import { revalidatePath } from 'next/cache'

export const createBanner = async (data: Omit<Banner, 'id'>) => {
    const result = await BannerService.createBanner(data)

    if (result.statusCode === Status.Created) {
        revalidatePath('/admin/banner')
        revalidatePath('/admin/banner/create')
    }
    return result
}

export const updateBanner = async (id: string, data: Omit<Banner, 'id'>) => {
    const result = await BannerService.updateBanner(id, data)

    if (result.statusCode === Status.Ok) {
        revalidatePath('/admin/banner')
        revalidatePath(`/admin/banner/${id}`)
    }
    return result
}

export const deleteBanner = async (id: string) => {
    const result = await BannerService.deleteBanner(id)
    if (result.statusCode === Status.Ok) {
        revalidatePath('/admin/banner')
        revalidatePath(`/admin/banner/${id}`)
    }
    return result
}

export const restoreBanner = async (id: string) => {
    const result = await BannerService.restoreBanner(id)
    if (result.statusCode === Status.Ok) {
        revalidatePath('/admin/banner')
        revalidatePath(`/admin/banner/${id}`)
    }
    return result
}
