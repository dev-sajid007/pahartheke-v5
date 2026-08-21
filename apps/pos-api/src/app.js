import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const defaultOrigins = [
  "https://pos.pahartheke.com",
  "http://localhost:7100",
  "http://localhost:7101",
  "http://localhost:7103",
  "http://localhost:7104",
  "http://pos.pahartheke.com",
  "https://v2.pahartheke.com"
];

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim())
  : defaultOrigins;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Pahar POS API Running",
  });
});

app.use("/api", routes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
