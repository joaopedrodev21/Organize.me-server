import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UserRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/app.error.js";
import { EmailService } from "./email.service.js";


const userRepository = new UserRepository();

export class AuthService {
  private emailService = new EmailService();
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

    await this.emailService.sendPasswordReset(user.email, user.name, resetToken);
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