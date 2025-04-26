import { BulletinRepo } from '@/repository/bulletin'
import { Bulletin } from '@/types/bulletin.type'
import { InterfaceResults } from '@/types/result.type'
import { SearchType } from '@/types/utils.type'
import { Language, Prisma, Status } from '@prisma/client'
import { Status as StatusCode } from '@reflet/http'

export const BulletinService = {
    async getAllBulletins(args: SearchType): Promise<InterfaceResults<Bulletin>> {
        try {
            const page = Math.max(1, args.page ?? 1)
            const size = Math.max(1, args.limit ?? 10)
            const skip = (page - 1) * size
            const take = size

            const whereCondition: Prisma.BulletinWhereInput = {}

            if (args.categories && args.categories.length > 0) {
                whereCondition.category = {
                    in: args.categories,
                }
            }

            if (args.isDraft !== undefined) {
                whereCondition.isDraft = args.isDraft
            }

            if (args.isImportant !== undefined) {
                whereCondition.isImportant = args.isImportant
            }

            if (args.language !== undefined) {
                whereCondition.language = args.language
            }

            if (args.keyword) {
                const keyword = args.keyword.toLowerCase().trim()
                whereCondition.OR = [
                    { title: { contains: keyword, mode: 'insensitive' } },
                    { description: { contains: keyword, mode: 'insensitive' } },
                    { body: { contains: keyword, mode: 'insensitive' } },
                ]
            }

            const [bulletins, total] = await Promise.all([
                BulletinRepo.getAll({
                    where: whereCondition,
                    orderBy: { createdAt: 'desc' },
                    take,
                    skip,
                }),
                BulletinRepo.getCount({ where: whereCondition }),
            ])

            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: {
                    content: bulletins as Bulletin[],
                    totalElements: total,
                    totalPages: Math.ceil(total / size),
                    currentPage: page,
                    size,
                },
            }
        } catch (error) {
            console.error('❌ Error in getAllBulletins:', error)
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

    async createBulletin(data: Bulletin) {
        try {
            const existingBulletin = await BulletinRepo.getFirstById({
                where: { slug: data.slug, language: data.language, category: data.category },
            })

            if (existingBulletin) {
                return {
                    message: 'Slug đã tồn tại',
                    statusCode: StatusCode.BadRequest,
                }
            }

            await BulletinRepo.create({
                data: {
                    ...data,
                    category: data.category,
                    thumbnails: data.thumbnails as string,
                    status: data.status as Status,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            })

            return {
                message: 'Bản tin đã được tạo thành công',
                statusCode: StatusCode.Created,
            }
        } catch (error) {
            console.error('❌ Error in createBulletin:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async getBulletinById(id: string) {
        try {
            if (!id) throw new Error('Bulletin ID is required')

            const bulletin = await BulletinRepo.getById({
                where: { id },
            })

            if (!bulletin) {
                return {
                    message: 'Bản tin không tồn tại',
                    statusCode: StatusCode.NotFound,
                }
            }

            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: bulletin,
            }
        } catch (error) {
            console.error('❌ Error in getUserById:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async getBulletinByIdAndLanguage(id: string, language?: Language) {
        try {
            if (!id && !language) throw new Error('Bulletin slug is required')

            const bulletin = await BulletinRepo.getFirstById({
                where: {
                    id,
                    language,
                },
            })

            if (!bulletin) {
                return {
                    message: 'Bản tin không tồn tại',
                    statusCode: StatusCode.NotFound,
                }
            }
            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: bulletin,
            }
        } catch (error) {
            console.error('❌ Error in getUserById:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async updateBulletin(id: string, data: Bulletin) {
        try {
            const bulletin = await BulletinRepo.getById({ where: { id } })

            if (!bulletin) {
                return {
                    message: 'Bản tin không tồn tại',
                    statusCode: StatusCode.NotFound,
                }
            }
            delete data.id

            await BulletinRepo.update({
                where: { id },
                data: {
                    ...data,
                    status: data.status as Status,
                    thumbnails: data.thumbnails as string,
                    updatedAt: new Date(),
                },
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

    async deleteBulletin(id: string) {
        try {
            const existingBulletin = await BulletinRepo.getById({ where: { id } })

            if (!existingBulletin) {
                return {
                    message: 'Bulletin not found',
                    statusCode: StatusCode.NotFound,
                }
            }

            await BulletinRepo.update({
                where: { id },
                data: {
                    status: Status.Achieved,
                    updatedAt: new Date(),
                },
            })

            return {
                message: 'Bulletin status updated to Achieved successfully',
                statusCode: StatusCode.Ok,
            }
        } catch (error) {
            console.error('❌ Error in delete bulletin:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async restoreBulletin(id: string) {
        try {
            const existingBulletin = await BulletinRepo.getById({ where: { id } })

            if (!existingBulletin) {
                return {
                    message: 'Bulletin not found',
                    statusCode: StatusCode.NotFound,
                }
            }

            await BulletinRepo.update({
                where: { id },
                data: {
                    status: Status.Published,
                    updatedAt: new Date(),
                },
            })

            return {
                message: 'Bulletin status updated to Published successfully',
                statusCode: StatusCode.Ok,
            }
        } catch (error) {
            console.error('❌ Error in restore bulletin:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async createManyBulletins(data: Bulletin[]) {
        try {
            await BulletinRepo.createMany({
                data: data.map((bulletin) => ({
                    ...bulletin,
                    status: bulletin.status as Status,
                    thumbnails: bulletin.thumbnails as string,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    language: (bulletin.language as Language) || 'VI',
                })),
            })

            return {
                message: 'Bulletins have been created successfully',
                statusCode: StatusCode.Created,
            }
        } catch (error) {
            console.error('❌ Error in create many bulletins:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async getLatestBulletins(
        currentId: string,
        args: SearchType
    ): Promise<InterfaceResults<Bulletin>> {
        console.log('currentId', currentId)

        try {
            const page = Math.max(1, args.page ?? 1)
            const size = Math.max(1, args.limit ?? 10)
            const skip = (page - 1) * size
            const take = size

            const whereCondition: Prisma.BulletinWhereInput = { id: { not: currentId } }

            if (args.categories && args.categories.length > 0) {
                whereCondition.category = {
                    in: args.categories,
                }
            }

            if (args.isDraft !== undefined) {
                whereCondition.isDraft = args.isDraft
            }

            if (args.isImportant !== undefined) {
                whereCondition.isImportant = args.isImportant
            }

            if (args.language !== undefined) {
                whereCondition.language = args.language
            }

            if (args.keyword) {
                const keyword = args.keyword.toLowerCase().trim()
                whereCondition.OR = [
                    { title: { contains: keyword, mode: 'insensitive' } },
                    { description: { contains: keyword, mode: 'insensitive' } },
                    { body: { contains: keyword, mode: 'insensitive' } },
                ]
            }

            const [bulletins, total] = await Promise.all([
                BulletinRepo.getAll({
                    where: whereCondition,
                    orderBy: { createdAt: 'desc' },
                    take,
                    skip,
                }),
                BulletinRepo.getCount({
                    where: whereCondition,
                }),
            ])

            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: {
                    content: bulletins as Bulletin[],
                    totalElements: total,
                    totalPages: Math.ceil(total / size),
                    currentPage: page,
                    size,
                },
            }
        } catch (error) {
            console.error('❌ Error in getLatestBulletins:', error)
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
}
