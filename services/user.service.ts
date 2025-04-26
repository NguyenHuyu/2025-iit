import { database } from '@/lib/instance'
import { UserRepo } from '@/repository/user'
import { InterfaceResults } from '@/types/result.type'
import { User } from '@/types/user.type'
import { Prisma, Role } from '@prisma/client'
import { Status as StatusCode } from '@reflet/http'
import bcrypt from 'bcrypt'

type UserSearchType = {
    filters?: {
        filter: 'email' | 'role' | 'name'
        value: string
    }[]
    limit?: number
    page?: number
}

export const UserService = {
    async getAllUsers(args: UserSearchType): Promise<InterfaceResults<User>> {
        const filters = args.filters ?? []
        try {
            const page = Math.max(1, args.page ?? 1)
            const size = Math.max(1, args.limit ?? 10)
            const skip = (page - 1) * size
            const take = size

            const whereCondition: Prisma.UserWhereInput = {}

            if (filters.length > 0) {
                const conditions: Prisma.UserWhereInput[] = []

                filters.forEach(({ filter, value }) => {
                    if (filter === 'email') {
                        conditions.push({ email: { contains: value, mode: 'insensitive' } })
                    }
                    if (filter === 'role') {
                        conditions.push({ role: value as Role })
                    }
                    if (filter === 'name') {
                        conditions.push({ name: { contains: value, mode: 'insensitive' } })
                    }
                })

                whereCondition.OR = conditions
            }

            const [users, total] = await Promise.all([
                UserRepo.getAll({
                    where: whereCondition,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        permissions: true,
                        pages: true,
                    },
                    take,
                    skip,
                }),
                UserRepo.getCount({
                    where: whereCondition,
                }),
            ])

            const data = users as unknown as User[]

            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: {
                    content: data,
                    totalElements: total,
                    totalPages: Math.ceil(total / size),
                    currentPage: page,
                    size,
                },
            }
        } catch (error) {
            console.error('❌ Error in getAllUsers:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
                data: {
                    content: [],
                    totalElements: 0,
                    totalPages: 0,
                    currentPage: 1,
                    size: 10,
                },
            }
        }
    },

    async getUserById(id: string) {
        try {
            if (!id) throw new Error('User ID is required')

            const user = await UserRepo.getById({
                where: { id },
                include: {
                    permissions: true,
                    pages: true,
                },
            })

            if (!user) {
                return {
                    message: 'Người dùng không tồn tại',
                    statusCode: StatusCode.NotFound,
                }
            }
            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: user,
            }
        } catch (error) {
            console.error('❌ Error in getUserById:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async createUser(data: User) {
        try {
            const { email, password, name, role } = data

            const hashedPassword = await bcrypt.hash(password, 10)

            const existingUser = await UserRepo.getById({ where: { email } })

            if (existingUser) {
                return {
                    message: 'Người dùng đã tồn tại',
                    statusCode: StatusCode.Conflict,
                }
            }

            await UserRepo.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: role || 'USER',
                },
            })

            return {
                message: 'Người dùng đã được tạo thành công',
                statusCode: StatusCode.Created,
            }
        } catch (error) {
            console.error('❌ Error in createUser:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async updateUser(id: string, data: User) {
        try {
            const existingUser = await UserRepo.getById({ where: { id } })

            if (!existingUser) {
                return {
                    message: 'Người dùng không tồn tại',
                    statusCode: StatusCode.NotFound,
                }
            }

            const updateData = { ...data }

            if (data.password) {
                updateData.password = await bcrypt.hash(data.password, 10)
            }

            await UserRepo.update({
                where: { id },
                data: updateData,
            })

            return {
                message: 'Người dùng đã được cập nhật thành công',
                statusCode: StatusCode.Ok,
            }
        } catch (error) {
            console.error('❌ Error in updateUser:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async deleteUser(id: string) {
        try {
            const existingUser = await database.user.findUnique({ where: { id } })

            if (!existingUser) {
                return {
                    message: 'User not found',
                    statusCode: StatusCode.NotFound,
                }
            }

            await database.user.delete({ where: { id } })

            return {
                message: 'User deleted successfully',
                statusCode: StatusCode.Ok,
            }
        } catch (error) {
            console.error('❌ Error in deleteUser:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },
}
