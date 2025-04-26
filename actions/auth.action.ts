'use server'

import { createSession, deleteSession } from '@/lib/session'
import { UserRepo } from '@/repository/user'
import bcrypt from 'bcrypt'
import { InterfaceResult, InterfaceStatusResult } from '@/types/result.type'
import { LoginUser, User } from '@/types/user.type'
import { Status } from '@reflet/http'

export const loginUser = async (data: LoginUser): Promise<InterfaceResult<User>> => {
    if (!data) throw new Error('Something went wrong!')

    const user = await UserRepo.getById({
        where: {
            email: data.email,
        },
    })

    if (!user) {
        return {
            message: 'Invalid',
            statusCode: Status.NotFound,
        }
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password)

    if (!isValidPassword) {
        return {
            message: 'Invalid',
            statusCode: Status.Unauthorized,
        }
    }

    await createSession(user.email)

    return {
        statusCode: Status.Ok,
        message: 'Login success',
    }
}

export const logoutUser = async (): Promise<InterfaceStatusResult> => {
    await deleteSession()

    return {
        statusCode: Status.Ok,
        message: 'Logout success',
    }
}
