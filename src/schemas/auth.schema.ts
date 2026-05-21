import { z } from 'zod';

export const registerSchema = z.object({
    name: z
        .string()
        .min(3, "Nome precisa ter no mínimo 3 caracteres"),

    email: z
        .string()
        .email("Email inválido"),
    password: z
        .string()
        .min(8, "Senha precisa ter no mínimo 8 caracteres") 
})

export const loginSchema = z.object({
    email: z
        .string()
        .email("Email inválido"),
    password: z
        .string()
        .min(8, "Senha precisa ter no mínimo 8 caracteres")
})