import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
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
}