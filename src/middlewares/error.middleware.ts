import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app.error.js';

export function errorMiddleware(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Dados inválidos",
            errors: err.issues.map(i => ({ field: i.path.join ('.'), message: i.message }))
        });
    }
    if(err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            details: err.details ?? null
        }); 
    }

    return res.status(500).json({
        message: "Erro interno do servidor"
    });
}
