import { Router } from "express";
import { TaskController } from "../controllers/tasks.controller.js";
import { UserController } from  "../controllers/users.controller.js";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = Router();
const taskController = new TaskController();
const userController = new UserController();
const authController = new AuthController();

//Rotas de Tasks:
router.get("/tasks", authMiddleware, taskController.getAllbyUser);
router.post("/tasks", authMiddleware, taskController.create);
router.get("/tasks/:id", authMiddleware, taskController.getById);
router.put("/tasks/:id", authMiddleware, taskController.update);
router.delete("/tasks/:id", authMiddleware, taskController.delete);

//Rotas de Users
router.get("/users/me", authMiddleware, userController.getMe);
router.put("/users/me", authMiddleware, userController.updateMe);
router.delete("/users/me", authMiddleware, userController.deleteMe);

//Rotas de Auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password", authController.resetPassword);


// Health Check (para o Render e Docker)
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

//Main Router:
router.get("/", (req, res) => {
  res.send("API is running");
});

export default router;
