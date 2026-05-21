import { UserRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/app.error.js";

const userRepository = new UserRepository();

export class UsersService {
  async updateMe(userId: number, data: { name?: string; email?: string }) {
    const current = await userRepository.getById(userId);
    if (!current) throw new AppError("Usuário não encontrado", 404);

    if (data.email && data.email !== current.email) {
      const emailInUse = await userRepository.getByEmail(data.email);
      if (emailInUse) throw new AppError("Email já está em uso", 409);
    }

    return userRepository.update(userId, data);
  }
  async getMe(userId: number) {
     const user = await userRepository.getById(userId);
     if(!user) throw new AppError("Usuário não encontrado", 404);
     return user;
  }
  async deleteMe(userId: number) {
    const user = await userRepository.getById(userId);
    if (!user) throw new AppError("Usuário não encontrado", 404);
    return userRepository.delete(userId);
  }
}