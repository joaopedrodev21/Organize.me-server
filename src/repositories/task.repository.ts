import { prisma } from "../database/prismaClient.js";
import { Prisma } from "@prisma/client";

//Criação do TaskRepository com crud de tarefas

export class TaskRepository {
    create(data: Prisma.TaskCreateInput){
        return prisma.task.create({data});
    }
    getAllByUser(userId: number){
        return prisma.task.findMany({ where: { userId } });
    }
    getByIdAndUser(id: number, userId: number){
        return prisma.task.findFirst({ where: { id, userId } });
    }
    updateByIdAndUser(id: number, userId: number, data: Prisma.TaskUpdateInput){
        return prisma.task.updateMany({ where: { id, userId }, data });
    }
    deleteByIdAndUser(id: number, userId: number){
        return prisma.task.deleteMany({ where: { id, userId } });
    }
    async getAllByUserWithFilters(params: {
        userId: number;
        done?: boolean;
        priority?: "LOW" | "HIGH";
        page?: number;
        limit?: number;
        sortBy?: "createdAt" | "dueDate" | "priority";
        order?: "asc" | "desc";
     }) {
        const { userId, done, priority, page, limit = 10, sortBy = "createdAt", order = "desc" } = params;
        const where: Prisma.TaskWhereInput = { userId, ...(done !== undefined ? { done } : {}), ...(priority ? { priority } : {}) };

        const [items, total] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy: { [sortBy]: order },
                skip: ((page ?? 1) - 1) * limit,
                take: limit
            }),
            prisma.task.count({ where })
        ])
        return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }; 
}
