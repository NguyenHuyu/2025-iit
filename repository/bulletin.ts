import { Prisma } from '@prisma/client'
import { database } from '@/lib/instance'

export const BulletinRepo = {
    async getAll(args?: Prisma.BulletinFindManyArgs) {
        return database.bulletin.findMany(args)
    },
    async getCount(args: Prisma.BulletinCountArgs) {
        return database.bulletin.count(args)
    },
    async getById(args: Prisma.BulletinFindUniqueArgs) {
        return database.bulletin.findUnique(args)
    },
    async getFirstById(args: Prisma.BulletinFindFirstArgs) {
        return database.bulletin.findFirst(args)
    },
    async create(args: Prisma.BulletinCreateArgs) {
        return database.bulletin.create(args)
    },
    async createMany(args: Prisma.BulletinCreateManyArgs) {
        return database.bulletin.createMany(args)
    },
    async update(args: Prisma.BulletinUpdateArgs) {
        return database.bulletin.update(args)
    },
    async delete(args: Prisma.BulletinDeleteArgs) {
        return database.bulletin.delete(args)
    },
}
