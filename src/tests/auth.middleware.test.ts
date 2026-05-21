import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

function createMockResponse() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe("authMiddleware", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it("should return 401 when token is not provided", () => {
    const req = { headers: {} } as Request;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token não informado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", () => {
    const req = { headers: { authorization: "Bearer invalid-token" } } as Request;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;
    vi.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("invalid");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token inválido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next and set req.user when token is valid", () => {
    const req = { headers: { authorization: "Bearer valid-token" } } as Request;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    vi.spyOn(jwt, "verify").mockReturnValue({ sub: "1", email: "joao@mail.com" } as never);

    authMiddleware(req, res, next);

    expect(req.user).toEqual({ id: 1, email: "joao@mail.com" });
    expect(next).toHaveBeenCalledOnce();
  });
});
