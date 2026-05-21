import { type NextFunction, type Request, type Response } from "express";
import { updateUserSchema } from "../schemas/user.schema.js";
import { UsersService } from "../services/users.service.js";

const userService = new UsersService();

export class UserController {
    async getMe(req: Request, res: Response, next: NextFunction){
        try {
            const user = await userService.getMe(req.user!.id);
            return res.json(user);
        } catch (error: any) {
            return next(error);
        }
    }
    async updateMe(req: Request, res: Response, next: NextFunction){
        try {
            const userId = req.user!.id;
            const validatedData = updateUserSchema.parse(req.body);
            const updateData: {name?: string; email?: string} = {};
            if(validatedData.name !== undefined) updateData.name = validatedData.name;
            if(validatedData.email !== undefined) updateData.email = validatedData.email;
            const user = await userService.updateMe(userId, updateData);
            return res.json(user);
        } catch (error: any) {
            return next(error);
        }
    }
    async deleteMe(req: Request, res: Response, next: NextFunction){
        try {
            await userService.deleteMe(req.user!.id);
            return res.status(204).send()
        } catch (error: any) {
            return next(error);
        }
    }
}
