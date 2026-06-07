import "dotenv/config";
import express from 'express';
import router from "./routes/main.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));
app.use('/', router);
app.use(errorMiddleware);

export default app;