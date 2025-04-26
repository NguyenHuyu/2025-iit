import { BannerRepo } from '@/repository/banner'
import { Banner } from '@/types/banner.type'
import { InterfaceResults } from '@/types/result.type'
import { Prisma, Status } from '@prisma/client'
import { Status as StatusCode } from '@reflet/http'

type SearchType = {
    filters?: {
        filter?: string
        value?: string
    }[]
    limit?: number
    page?: number
}

export const BannerService = {
    async getAllBanners(args: SearchType): Promise<InterfaceResults<Banner>> {
        const filters = args.filters ?? []
        try {
            const page = Math.max(1, args.page ?? 1)
            const size = Math.max(1, args.limit ?? 10)
            const skip = (page - 1) * size
            const take = size

            let whereCondition: Prisma.BannerWhereInput = {}

            if (filters.length > 0) {
                const conditions: Prisma.BannerWhereInput[] = []

                filters.forEach(({ filter, value }) => {
                    if (!value) return //

                    switch (filter) {
                        case 'name':
                            conditions.push({ name: { contains: value, mode: 'insensitive' } })
                            break
                        case 'status':
                            if (Object.values(Status).includes(value as Status)) {
                                conditions.push({ status: value as Status })
                            }
                            break
                        default:
                            break
                    }
                })

                if (conditions.length > 1) {
                    whereCondition.OR = conditions
                } else if (conditions.length === 1) {
                    whereCondition = conditions[0]
                }
            }

            const [banners, total] = await Promise.all([
                BannerRepo.getAll({
                    where: whereCondition,
                    orderBy: { createdAt: 'desc' },
                    take,
                    skip,
                }),
                BannerRepo.getCount({
                    where: whereCondition,
                }),
            ])

            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: {
                    content: banners as Banner[],
                    totalElements: total,
                    totalPages: Math.ceil(total / size),
                    currentPage: page,
                    size,
                },
            }
        } catch (error) {
            console.error('❌ Error in get all banner:', error)
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

    async createBanner(data: Omit<Banner, 'id'>) {
        try {
            await BannerRepo.create({
                data: {
                    ...data,
                    status: data.status as Status,
                    url: data.url as string,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            })

            return {
                message: 'Banner has been created successfully',
                statusCode: StatusCode.Created,
            }
        } catch (error) {
            console.error('❌ Error in create bulletin:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async getBannerById(id: string) {
        try {
            if (!id) throw new Error('Banner ID is required')

            const banner = await BannerRepo.getById({
                where: { id },
            })

            if (!banner) {
                return {
                    message: 'Banner not found',
                    statusCode: StatusCode.NotFound,
                }
            }
            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: banner,
            }
        } catch (error) {
            console.error('❌ Error in get banner id:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async updateBanner(id: string, data: Omit<Banner, 'id'>) {
        try {
            const banner = await BannerRepo.getById({ where: { id } })

            if (!banner) {
                return {
                    message: 'Banner not found',
                    statusCode: StatusCode.NotFound,
                }
            }

            await BannerRepo.update({
                where: { id },
                data: {
                    ...data,
                    status: data.status as Status,
                    url: data.url as string,
                    updatedAt: new Date(),
                },
            })

            return {
                message: 'Banner has been updated successfully',
                statusCode: StatusCode.Ok,
            }
        } catch (error) {
            console.error('❌ Error in update banner:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async deleteBanner(id: string) {
        try {
            const existingBanner = await BannerRepo.getById({ where: { id } })

            if (!existingBanner) {
                return {
                    message: 'Banner not found',
                    statusCode: StatusCode.NotFound,
                }
            }

            await BannerRepo.update({
                where: { id },
                data: {
                    status: Status.Achieved,
                    updatedAt: new Date(),
                },
            })

            return {
                message: 'Banner status updated to Achieved successfully',
                statusCode: StatusCode.Ok,
            }
        } catch (error) {
            console.error('❌ Error in delete banner:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async restoreBanner(id: string) {
        try {
            const existingBanner = await BannerRepo.getById({ where: { id } })

            if (!existingBanner) {
                return {
                    message: 'Bulletin not found',
                    statusCode: StatusCode.NotFound,
                }
            }

            await BannerRepo.update({
                where: { id },
                data: {
                    status: Status.Published,
                    updatedAt: new Date(),
                },
            })

            return {
                message: 'Banner status updated to Published successfully',
                statusCode: StatusCode.Ok,
            }
        } catch (error) {
            console.error('❌ Error in restore banner:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },
}
