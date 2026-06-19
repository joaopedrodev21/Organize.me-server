import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { UserRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/app.error.js";


const userRepository = new UserRepository();

export class AuthService {
  async register(name: string, email: string, password: string) {
    const exists = await userRepository.getByEmail(email);
    if (exists) throw new AppError("Email já cadastrado", 409);

    const passwordHash = await bcrypt.hash(password, 10);
    return userRepository.create({ name, email, passwordHash });
  }

  async login(email: string, password: string) {
    const user = await userRepository.getByEmail(email);
    if (!user) throw new AppError("Credenciais inválidas", 401);

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new AppError("Credenciais inválidas", 401);

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError("JWT_SECRET não configurado", 500);

    const token = jwt.sign({ sub: String(user.id), email: user.email }, secret, { expiresIn: "1h" });

    const { passwordHash: _, ...safeUser } = user;
    return { token, user: safeUser };
  }

  async forgotPassword(email: string) {
    const user = await userRepository.getByEmail(email);
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000);

    await userRepository.update(user.id, { resetToken, resetTokenExp });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      await transporter.verify();
    } catch (verifyError: any) {
      throw new AppError(
        `Falha na conexão com servidor de email: ${verifyError.message}`,
        502
      );
    }

    const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

    const fromEmail = process.env.SMTP_USER || "noreply@gmail.com";

    try {
      await transporter.sendMail({
        from: `"Organize.me" <${fromEmail}>`,
        to: user.email,
        subject: "Recuperação de Senha",
        html: `
          <p>Olá ${user.name},</p>
          <p>Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo para criar uma nova senha:</p>
          <a href="${resetLink}" target="_blank">Redefinir Senha</a>
          <p>Este link expira em 1 hora.</p>
        `
      });
    } catch (mailError: any) {
      throw new AppError(
        `Falha ao enviar email: ${mailError.message}`,
        502
      );
    }
  }
  
  async resetPassword(token: string, newPassword: string){
    const user = await userRepository.getByResetToken(token);
    if(!user || !user.resetTokenExp || user.resetTokenExp < new Date()){
      throw new AppError("Token inválido ou expirado", 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await userRepository.update(user.id, { passwordHash, resetToken: null, resetTokenExp: null });
  }
}