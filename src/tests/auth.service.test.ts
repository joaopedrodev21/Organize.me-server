import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/auth.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/app.error.js";

describe("AuthService", () => {
  const service = new AuthService();

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it("register should create user when email is available", async () => {
    vi.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(null as never);
    vi.spyOn(bcrypt, "hash").mockResolvedValue("hashed-password" as never);
    vi.spyOn(UserRepository.prototype, "create").mockResolvedValue({
      id: 1,
      name: "Joao",
      email: "joao@mail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const result = await service.register("Joao", "joao@mail.com", "12345678");

    expect(result.email).toBe("joao@mail.com");
    expect(bcrypt.hash).toHaveBeenCalledWith("12345678", 10);
  });

  it("register should throw when email already exists", async () => {
    vi.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue({ id: 1 } as never);

    await expect(service.register("Joao", "joao@mail.com", "12345678")).rejects.toBeInstanceOf(AppError);
  });

  it("login should return token and safe user with valid credentials", async () => {
    vi.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue({
      id: 1,
      email: "joao@mail.com",
      name: "Joao",
      passwordHash: "hash",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);
    vi.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
    vi.spyOn(jwt, "sign").mockReturnValue("token-123" as never);

    const result = await service.login("joao@mail.com", "12345678");

    expect(result.token).toBe("token-123");
    expect((result.user as any).passwordHash).toBeUndefined();
  });

  it("login should throw with invalid password", async () => {
    vi.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue({
      id: 1,
      email: "joao@mail.com",
      name: "Joao",
      passwordHash: "hash",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);
    vi.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

    await expect(service.login("joao@mail.com", "wrong-pass")).rejects.toBeInstanceOf(AppError);
  });
});
