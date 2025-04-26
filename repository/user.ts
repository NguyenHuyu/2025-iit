import { Prisma } from '@prisma/client'
import { database } from '@/lib/instance'

export const UserRepo = {
    async getAll(args?: Prisma.UserFindManyArgs) {
        return database.user.findMany(args)
    },
    async getCount(args: Prisma.UserCountArgs) {
        return database.user.count(args)
    },
    async getById(args: Prisma.UserFindUniqueArgs) {
        return database.user.findUnique(args)
    },

    async create(args: Prisma.UserCreateArgs) {
        return database.user.create(args)
    },
    async update(args: Prisma.UserUpdateArgs) {
        return database.user.update(args)
    },
    async delete(args: Prisma.UserDeleteArgs) {
        return database.user.delete(args)
    },
}
