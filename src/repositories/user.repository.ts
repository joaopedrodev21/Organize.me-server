// Criação do userRepository com CRUD de usuários:
import { prisma } from "../database/prismaClient.js"
import { Prisma } from "@prisma/client"

const safeUserSelect = {
    id: true,
    name: true,
    email: true,
    createdAt: true,
    updatedAt: true,
} as const;

export class UserRepository {
    create(data: Prisma.UserCreateInput) {
        return prisma.user.create({ data, select: safeUserSelect })
    }
    getAll(){
        return prisma.user.findMany({ select: safeUserSelect });
    }
    getById(id: number){
        return prisma.user.findUnique({ where: {id}, select: safeUserSelect })
    } 
    getByEmail(email: string){
        return prisma.user.findUnique({ where: {email} })
    }
    update(id: number, data: Prisma.UserUpdateInput){
        return prisma.user.update({ where: {id}, data, select: safeUserSelect })
    }
    delete(id: number){
        return prisma.user.delete({ where: {id}, select: safeUserSelect })
    }
}