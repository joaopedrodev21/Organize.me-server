import { type NextFunction, type Request, type Response } from 'express';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema.js';
import { AuthService } from '../services/auth.service.js';
import { ca } from 'zod/locales';

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
    async forgotPassword(req: Request, res: Response, next: NextFunction){
        try{
            const validatedData = forgotPasswordSchema.parse(req.body);
            await authService.forgotPassword(validatedData.email);
            return res.json({ message: "Se o email existir, você receberá um link de recuperação." });
        }catch(error: any){
            return next(error);
        }
    }
    async resetPassword(req: Request, res: Response, next: NextFunction){
        try{
            const validatedData = resetPasswordSchema.parse(req.body);
            await authService.resetPassword(validatedData.token, validatedData.password);
            return res.json({ message: "Senha redefinida com sucesso." });
        }catch(error: any){
            return next(error);
        }
    }
}
