import { Prisma } from '@prisma/client'
import { database } from '@/lib/instance'

export const PageRepo = {
    async getAll(args?: Prisma.PagesFindManyArgs) {
        return database.pages.findMany(args)
    },
    async getCount(args?: Prisma.PagesCountArgs) {
        return database.pages.count(args)
    },
    async getById(args: Prisma.PagesFindUniqueArgs) {
        return database?.pages?.findUnique(args)
    },
    async getFirstById(args: Prisma.PagesFindFirstArgs) {
        return database.pages.findFirst(args)
    },
    async create(args: Prisma.PagesCreateArgs) {
        return database.pages.create(args)
    },
    async createMany(args: Prisma.PagesCreateManyArgs) {
        return database.pages.createMany(args)
    },
    async update(args: Prisma.PagesUpdateArgs) {
        return database.pages.update(args)
    },
    async delete(args: Prisma.PagesDeleteArgs) {
        return database.pages.delete(args)
    },
}
