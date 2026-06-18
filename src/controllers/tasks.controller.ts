import { type NextFunction ,type Request, type Response } from "express";
import { TasksService } from "../services/tasks.service.js"; 
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";
import { listTasksQuerySchema } from "../schemas/task.schema.js";

const taskService = new TasksService();

export class TaskController {
  async getAllbyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const query = listTasksQuerySchema.parse(req.query);
      const done = query.done === undefined ? undefined : query.done === "true";

      const result = await taskService.getAllByUser({
        userId,
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        order: query.order,
        ...(done !== undefined ? { done } : {}),
        ...(query.priority !== undefined ? { priority: query.priority } : {}),
      });
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createTaskSchema.parse(req.body);
      const userId = req.user!.id;

      const task = await taskService.create({
        userId,
        title: validatedData.title,
        description: validatedData.description,
        done: validatedData.done,
        priority: validatedData.priority,
        dueDate: validatedData.dueDate
      });
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

      const task = await taskService.getById(taskId, userId);
      return res.json(task);
    } catch (error) {
      return res.status(404).json({ message: (error as Error).message });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = Number(req.params.id);
      const userId = req.user!.id;

      if (isNaN(taskId)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const validatedData = updateTaskSchema.parse(req.body);

      const updatedTask = await taskService.update(taskId, userId, validatedData);
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

      await taskService.delete(taskId, userId);
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ message: (error as Error).message });
    }
  }
}