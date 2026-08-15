import "dotenv/config";
import express from 'express';
import router from "./routes/main.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors";
import { setupSwagger } from "./docs/swagger.config.js";

const app = express();

const normalizeOrigin = (url?: string) => url?.replace(/\/+$/, "") ?? undefined;
const apiUrl = normalizeOrigin(process.env.API_URL) ?? "http://localhost:3000";
const allowedOrigins = [normalizeOrigin(process.env.CLIENT_URL), apiUrl].filter(Boolean);

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS policy does not allow access from this origin."));
  },
  credentials: true
}));
app.use('/', router);
setupSwagger(app);
app.use(errorMiddleware);

export default app;