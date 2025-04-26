'use server'

import { BulletinService } from '@/services/bulletin.service'
import { Bulletin } from '@/types/bulletin.type'
import { SearchType } from '@/types/utils.type'
import { Status } from '@reflet/http'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export const getAllBulletins = async (
    args: SearchType
): Promise<ReturnType<typeof BulletinService.getAllBulletins>> => {
    return await BulletinService.getAllBulletins(args)
}

export const createBulletin = async (data: Omit<Bulletin, 'id'>) => {
    const result = await BulletinService.createBulletin(data)

    if (result.statusCode === Status.Created) {
        revalidatePath('/admin/bulletin')
        revalidatePath('/admin/bulletin/create')
    }
    return result
}

export const createBulletinMany = async (data: Bulletin[]) => {
    const result = await BulletinService.createManyBulletins(data)

    if (result.statusCode === Status.Created) {
        revalidatePath('/admin/bulletin')
        revalidatePath('/admin/bulletin/create')
    }
    return result
}

export const updateBulletin = async (id: string, data: Omit<Bulletin, 'id'>) => {
    const result = await BulletinService.updateBulletin(id, data)
    const language = (await cookies()).get('language')?.value

    if (result.statusCode === Status.Ok) {
        revalidatePath('/admin/bulletin')
        revalidatePath(`/admin/bulletin/${id}`)
        revalidatePath(`/${language}`)

        revalidatePath(`/${language}/khoa-hoc`)
        revalidatePath(`/${language}/khoa-hoc/${id}`)
    }
    return result
}

export const deleteBulletin = async (id: string) => {
    const result = await BulletinService.deleteBulletin(id)
    if (result.statusCode === Status.Ok) {
        revalidatePath('/admin/bulletin')
        revalidatePath(`/admin/bulletin/${id}`)
    }
    return result
}

export const restoreBulletin = async (id: string) => {
    const result = await BulletinService.restoreBulletin(id)
    if (result.statusCode === Status.Ok) {
        revalidatePath('/admin/bulletin')
        revalidatePath(`/admin/bulletin/${id}`)
    }
    return result
}
