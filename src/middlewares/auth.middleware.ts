import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/auth.types.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token não informado" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token não informado" });
    }

    const jwtToken: string = token;
    const secret = process.env.JWT_SECRET;

    if(!secret){
        return res.status(500).json({ message : "JWT_SECRET não configurado" });
    }

    const jwtSecret: string = secret;

    try {
        const decoded = jwt.verify(jwtToken, jwtSecret);

        if (typeof decoded === "string" || !decoded.sub || !decoded.email) {
            return res.status(401).json({ message: "Token inválido" });
        }

        const payload = decoded as unknown as JwtPayload;

        req.user = { id: Number(payload.sub), email: payload.email };
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
}