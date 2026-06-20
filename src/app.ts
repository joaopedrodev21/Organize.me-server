import "dotenv/config";
import express from 'express';
import router from "./routes/main.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();

const normalizeOrigin = (url?: string) => url?.replace(/\/+$/, "") ?? undefined;
const allowedOrigins = [normalizeOrigin(process.env.CLIENT_URL)].filter(Boolean);

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
app.use(errorMiddleware);

export default app;