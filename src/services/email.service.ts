import nodemailer from "nodemailer";
import { AppError } from "../utils/app.error.js";

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(){
        const host = process.env.EMAIL_HOST;
        const port = process.env.EMAIL_PORT;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if(!host || !port || !user || !pass){
            throw new AppError("Servidor de email não configurado", 502);
        }

        this.transporter = nodemailer.createTransport({
            host,
            port: Number(port),
            secure: Number(port) === 465, // True se for 465, false se for outras portas,
            auth: {user, pass}
        });
    }

    async sendPasswordReset(email: string, name: string, token: string) {
        const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;

        await this.transporter.sendMail({
            from: `Organize.me <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Redefinição de senha",
            html: `
                <p>Olá, ${name}!</p>
                <p>Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo para redefinir.</p>
                <a href="${resetLink}" target="_blank">Redefinir Senha</a>
                <p>Se você não solicitou essa redefinição, ignore este e-mail.</p>
            `
        });

    }

}