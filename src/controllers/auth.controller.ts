import { type NextFunction, type Request, type Response } from 'express';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction){
        try{
            const validatedData = registerSchema.parse(req.body);

            const user = await authService.register(
                validatedData.name,
                validatedData.email,
                validatedData.password,
            );

            return res.status(201).json(user);
        }
        catch(error: any){
            return next(error)
        }
    }
    async login(req: Request, res: Response, next: NextFunction){
        try{
            const validatedData = loginSchema.parse(req.body);

            const result = await authService.login(validatedData.email, validatedData.password);
            return res.json(result);
        }
        catch(error: any){
            return next(error);
        } 
    }
}
