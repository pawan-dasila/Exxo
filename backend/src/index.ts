import "dotenv/config";
import express, { Request, Response } from "express";
import { Env } from "./configs/env.config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { HTTPSTATUS } from "./configs/Https.config";
import { ErrorHandler } from "./middleware/ErrorHandler.middleware";
import morgan from "morgan";
import helmet from "helmet";
import { AsyncHandler } from "./middleware/AsyncHandler.middleware";
import prisma from "./lib/prisma";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import categoryRoutes from "./routes/category.route";
import productRoutes from "./routes/product.route";
import rentalRoutes from "./routes/rental.route";
import paymentRoutes from "./routes/payment.route";
import logger from "./utils/logger";
import { rateLimit } from "express-rate-limit";

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.use(
  express.json({
    verify: (req: Request, res: Response, buf: Buffer) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://demo.pawandasila.in",
      Env.FRONTEND_ORIGIN,
    ].filter(Boolean),
    credentials: true,
  }),
);

app.use(morgan(Env.NODE_ENV === "PRODUCTION" ? "combined" : "dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts, please try again after 15 minutes",
});

app.get(
  "/",
  AsyncHandler(async (req: Request, res: Response) => {
    const date = new Date();
    res.status(HTTPSTATUS.OK).json({
      message: "Luxe Rental API is running",
      date,
    });
  }),
);

// app.use(`${BASE_PATH}/products`, productRoutes);
app.use(`${BASE_PATH}/auth`, authRateLimiter, authRoutes);
app.use(`${BASE_PATH}/user`, userRoutes);
app.use(`${BASE_PATH}/categories`, categoryRoutes);
app.use(`${BASE_PATH}/products`, productRoutes);
app.use(`${BASE_PATH}/rentals`, rentalRoutes);
app.use(`${BASE_PATH}/payments`, paymentRoutes);

app.use(ErrorHandler);

const initializeApp = async () => {
  try {
    await prisma.$connect();
    logger.info(
      `Prisma Postgres database connected successfully in ${Env.NODE_ENV} mode`,
    );
  } catch (error) {
    logger.error(error, "Failed to initialize database connection:");
    process.exit(1);
  }
};

const server = app.listen(Env.PORT, async () => {
  await initializeApp();
  logger.info(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  server.close(async () => {
    logger.info("HTTP server closed.");
    try {
      await prisma.$disconnect();
      logger.info("Prisma disconnected.");
      process.exit(0);
    } catch (err) {
      logger.error(err, "Error during Prisma disconnect:");
      process.exit(1);
    }
  });

  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;
