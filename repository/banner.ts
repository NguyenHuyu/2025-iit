import { Prisma } from '@prisma/client'
import { database } from '@/lib/instance'

export const BannerRepo = {
    async getAll(args?: Prisma.BannerFindManyArgs) {
        return database.banner.findMany(args)
    },
    async getCount(args: Prisma.BannerCountArgs) {
        return database.banner.count(args)
    },
    async getById(args: Prisma.BannerFindUniqueArgs) {
        return database.banner.findUnique(args)
    },
    async getFirstById(args: Prisma.BannerFindFirstArgs) {
        return database.banner.findFirst(args)
    },
    async create(args: Prisma.BannerCreateArgs) {
        return database.banner.create(args)
    },
    async createMany(args: Prisma.BannerCreateManyArgs) {
        return database.banner.createMany(args)
    },
    async update(args: Prisma.BannerUpdateArgs) {
        return database.banner.update(args)
    },
    async delete(args: Prisma.BannerDeleteArgs) {
        return database.banner.delete(args)
    },
}
