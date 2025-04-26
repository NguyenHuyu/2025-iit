'use server'

import { verifySession } from '@/lib/session'
import { UserService } from '@/services/user.service'
import { User } from '@/types/user.type'
import { Status } from '@reflet/http'
import { revalidatePath } from 'next/cache'

export const createUser = async (data: User) => {
    const result = await UserService.createUser(data)
    if (result.statusCode === Status.Created) revalidatePath('/admin/user')
    return result
}

export const updateUser = async (id: string, data: User) => {
    const result = await UserService.updateUser(id, data)

    if (result.statusCode === Status.Ok) {
        revalidatePath('/admin/user')
        revalidatePath(`/admin/user/${id}`)
    }
    return result
}

export const deleteUser = async (id: string) => {
    const result = await UserService.deleteUser(id)
    if (result.statusCode === Status.Ok) revalidatePath('/admin/user')
    return result
}
