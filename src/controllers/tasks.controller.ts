import { type NextFunction ,type Request, type Response } from "express";
import { TaskRepository } from "../repositories/task.repository.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";
import { listTasksQuerySchema } from "../schemas/task.schema.js";

const taskRepository = new TaskRepository();

export class TaskController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      
      const query = listTasksQuerySchema.parse(req.query);

      const done = query.done === undefined ? undefined : query.done === "true";

      const result = await taskRepository.getAllByUserWithFilters({
        userId,
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        order: query.order,
        ...(done !== undefined ? { done } : {}),
        ...(query.priority !== undefined ? { priority: query.priority } : {}),
      });
      return res.json(result);
    } catch (error: any) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createTaskSchema.parse(req.body);
      const userId = req.user!.id;

      const createData: any = {
        title: validatedData.title,
        done: validatedData.done,
        priority: validatedData.priority,
        user: { connect: { id: userId } },
      };

      if (validatedData.description !== undefined) createData.description = validatedData.description;
      if (validatedData.dueDate !== undefined) createData.dueDate = validatedData.dueDate;

      const task = await taskRepository.create(createData);
      return res.status(201).json(task);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.id);
      const userId = req.user!.id;

      if (isNaN(taskId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const task = await taskRepository.getByIdAndUser(taskId, userId);
      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      return res.json(task);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.id);
      const userId = req.user!.id;

      if (isNaN(taskId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const taskExists = await taskRepository.getByIdAndUser(taskId, userId);
      if (!taskExists) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      const validatedData = updateTaskSchema.parse(req.body);
      const updateData: any = {};

      if (validatedData.title !== undefined) updateData.title = validatedData.title;
      if (validatedData.description !== undefined) updateData.description = validatedData.description;
      if (validatedData.done !== undefined) updateData.done = validatedData.done;
      if (validatedData.priority !== undefined) updateData.priority = validatedData.priority;
      if (validatedData.dueDate !== undefined) updateData.dueDate = validatedData.dueDate;

      const updateResult = await taskRepository.updateByIdAndUser(taskId, userId, updateData);
      if (updateResult.count === 0) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      const updatedTask = await taskRepository.getByIdAndUser(taskId, userId);
      return res.json(updatedTask);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.id);
      const userId = req.user!.id;

      if (isNaN(taskId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const task = await taskRepository.getByIdAndUser(taskId, userId);
      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      const deleteResult = await taskRepository.deleteByIdAndUser(taskId, userId);
      if (deleteResult.count === 0) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}



