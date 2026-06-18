import { TaskRepository } from "../repositories/task.repository.js";

const taskRepository = new TaskRepository();

export class TasksService {
    async getAllByUser(params: {
        userId: number;
        done?: boolean;
        priority?: "LOW" | "HIGH";
        page?: number;
        limit?: number;
        sortBy?: "createdAt" | "dueDate" | "priority";
        order?: "asc" | "desc";
     }) {
        return await taskRepository.getAllByUserWithFilters(params);
    }
    async create(data: {
        userId: number;
        title: string;
        description?: string | undefined;
        done?: boolean | undefined;
        priority?: "LOW" | "HIGH" | undefined;
        dueDate?: string | undefined;
    }) {
        const createData: any = {
            title: data.title,
            done: data.done,
            priority: data.priority,
            user: { connect: { id: data.userId } },
        };
        if (data.description !== undefined) createData.description = data.description;
        if (data.dueDate !== undefined) createData.dueDate = data.dueDate;
        return await taskRepository.create(createData);
    }
    async getById(TaskId: number, userId: number) {
        const task = await taskRepository.getByIdAndUser(TaskId, userId);
        if (!task) throw new Error("Tarefa não encontrada");
        return task;
    }
    async update(TaskId: number, userId: number, data: {
        title?: string | undefined;
        description?: string | undefined;
        done?: boolean | undefined;
        priority?: "LOW" | "HIGH" | undefined;
        dueDate?: string | undefined;
    }) {
        const taskExists = await taskRepository.getByIdAndUser(TaskId, userId);
        if (!taskExists) throw new Error("Tarefa não encontrada");

        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.done !== undefined) updateData.done = data.done;
        if (data.priority !== undefined) updateData.priority = data.priority;
        if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;

        await taskRepository.updateByIdAndUser(TaskId, userId, updateData);
        return await taskRepository.getByIdAndUser(TaskId, userId);
    }
    async delete(TaskId: number, userId: number) {
        const taskExists = await taskRepository.getByIdAndUser(TaskId, userId);
        if (!taskExists) throw new Error("Tarefa não encontrada");

        await taskRepository.deleteByIdAndUser(TaskId, userId);
    }
}