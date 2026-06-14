import "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
            };
        }
    }
}

// Necessário para TypeScript tratar como módulo (moduleDetection: "force")
export {};
