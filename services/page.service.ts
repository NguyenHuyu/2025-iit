import { PageRepo } from '@/repository/page'
import { Pages } from '@/types/page.type'
import { InterfaceResult, InterfaceResults } from '@/types/result.type'
import { Language } from '@prisma/client'
import { Status as StatusCode } from '@reflet/http'
import { randomUUID } from 'crypto'

type SearchType = {
    filters?: {
        filter?: string
        value?: string
    }[]
    limit?: number
    page?: number
    isDraft?: boolean
    isImportant?: boolean
}

export const PageService = {
    async getAllPages(args: SearchType): Promise<InterfaceResults<Pages>> {
        try {
            const page = Math.max(1, args.page ?? 1)
            const size = Math.max(1, args.limit ?? 10)
            const skip = (page - 1) * size
            const take = size

            const [pages, total] = await Promise.all([
                PageRepo.getAll({
                    orderBy: { createdAt: 'desc' },
                    take,
                    skip,
                    include: {
                        openGraph: true,
                        metadata: true,
                        twitter: true,
                        pageContent: true,
                    },
                }),
                PageRepo.getCount(),
            ])

            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: {
                    content: pages as unknown as Pages[],
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

    async createPage(data: Omit<Pages, 'id'>) {
        try {
            const existingTitle = await PageRepo.getById({
                where: { slug: data.slug },
            })

            if (existingTitle) {
                return {
                    message: 'Tiêu đề đã tồn tại',
                    statusCode: StatusCode.Conflict,
                }
            }

            const generateId = randomUUID().toString()

            const result = await PageRepo.create({
                data: {
                    id: generateId,
                    title: data.title,
                    slug: data.slug,
                    metadataBase: data.metadataBase,
                    userId: 'd31d376a-c59f-4efc-b704-a1b2d9770dcd',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    openGraph: {
                        create: data.openGraph.map((og) => ({
                            ...og,
                            images: og.images as string,
                        })),
                    },
                    shortcutIcon: data.shortcutIcon as string,
                    appleIcon: data.appleIcon as string,
                    favicon: data.favicon as string,
                    metadata: {
                        create: data.metadata,
                    },
                    twitter: {
                        create: data.twitter.map((og) => ({
                            ...og,
                            images: og.images as string,
                        })),
                    },
                    pageContent: {
                        create: data?.pageContent ? data.pageContent : [],
                    },
                },
            })

            return {
                message: 'Trang đã được tạo thành công',
                statusCode: StatusCode.Created,
                data: result,
            }
        } catch (error) {
            console.error('❌ Error in create page:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async getPageById(id: string): Promise<InterfaceResult<Pages>> {
        try {
            if (!id) throw new Error('Page ID is required')
            console.log('id', id)
            const page = await PageRepo.getById({
                where: { id },
                include: {
                    openGraph: true,
                    metadata: true,
                    twitter: true,
                    pageContent: true,
                },
            })

            if (!page) {
                return {
                    message: 'Page không tồn tại',
                    statusCode: StatusCode.NotFound,
                }
            }
            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: page as unknown as Pages,
            }
        } catch (error) {
            console.error('❌ Error in page:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async getPageBySlug(slug: string): Promise<InterfaceResult<Pages>> {
        try {
            if (!slug) throw new Error('Slug ID is required')
            const page = await PageRepo.getById({
                where: {
                    slug,
                },
                include: {
                    openGraph: true,
                    metadata: true,
                    twitter: true,
                    pageContent: true,
                },
            })

            if (!page) {
                return {
                    message: 'Page không tồn tại',
                    statusCode: StatusCode.NotFound,
                }
            }
            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: page as unknown as Pages,
            }
        } catch (error) {
            console.error('❌ Error in page:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async getPageBySlugAndLanguage(
        slug: string,
        language: Language
    ): Promise<InterfaceResult<Pages>> {
        try {
            if (!slug) throw new Error('Page ID is required')

            const page = await PageRepo.getById({
                where: { slug },
                include: {
                    metadata: {
                        where: {
                            language: language ? language : undefined,
                        },
                    },
                    openGraph: {
                        where: { language: language ? language : undefined },
                    },
                    twitter: {
                        where: { language: language ? language : undefined },
                    },
                    pageContent: {
                        where: { language: language ? language : undefined },
                    },
                },
            })

            if (!page) {
                return {
                    message: 'Page không tồn tại',
                    statusCode: StatusCode.NotFound,
                }
            }
            return {
                message: 'Success',
                statusCode: StatusCode.Ok,
                data: page as unknown as Pages,
            }
        } catch (error) {
            console.error('❌ Error in page:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async updatePage(id: string, data: Pages) {
        try {
            const updated = await PageRepo.update({
                where: { id },
                data: {
                    title: data.title,
                    slug: data.slug,
                    metadataBase: data.metadataBase,
                    applicationName: data.applicationName,
                    author: data.author,
                    keywords: data.keywords,
                    appleIcon: data.appleIcon as string,
                    favicon: data.favicon as string,
                    shortcutIcon: data.shortcutIcon as string,
                    isSystem: data.isSystem ?? false,
                    isPageContent: data.isPageContent ?? true,

                    metadata: {
                        upsert: data.metadata.map((m) => {
                            return {
                                where: { id: m.id },
                                update: {
                                    title: m.title,
                                    description: m.description,
                                    language: m.language,
                                },
                                create: {
                                    language: m.language,
                                    title: m.title,
                                    description: m.description,
                                },
                            }
                        }),
                    },

                    pageContent: {
                        upsert: (data.pageContent || []).map((p) => ({
                            where: {
                                id: p.id,
                            },
                            update: {
                                content: p.content,
                            },
                            create: {
                                language: p.language,
                                content: p.content,
                            },
                        })),
                    },

                    openGraph: {
                        upsert: (data.openGraph || []).map((og) => ({
                            where: {
                                id: og.id,
                            },
                            update: {
                                title: og.title,
                                description: og.description,
                                images: og.images as string,
                            },
                            create: {
                                language: og.language,
                                title: og.title,
                                description: og.description,
                                images: og.images as string,
                            },
                        })),
                    },

                    twitter: {
                        upsert: (data.twitter || []).map((tw) => ({
                            where: {
                                id: tw.id,
                            },
                            update: {
                                title: tw.title,
                                description: tw.description,
                                images: tw.images as string,
                                language: tw.language,
                            },
                            create: {
                                language: tw.language,
                                title: tw.title,
                                description: tw.description,
                                images: tw.images as string,
                            },
                        })),
                    },
                },
            })

            return {
                message: 'Cập nhật thành công!',
                statusCode: StatusCode.Ok,
                data: updated,
            }
        } catch (error) {
            console.error('❌ Error in updatePage:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },

    async deletePage(id: string) {
        try {
            const existingPage = await PageRepo.getById({ where: { id } })

            if (!existingPage) {
                return {
                    message: 'Bulletin not found',
                    statusCode: StatusCode.NotFound,
                }
            }

            await PageRepo.delete({
                where: {
                    id,
                },
            })

            return {
                message: 'Xóa thành công!',
                statusCode: StatusCode.Ok,
            }
        } catch (error) {
            console.error('❌ Error in delete page:', error)
            return {
                message: 'Error',
                statusCode: StatusCode.InternalServerError,
            }
        }
    },
}
