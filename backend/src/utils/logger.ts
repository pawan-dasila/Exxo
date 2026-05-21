import pino from "pino";
import { Env } from '../configs/env.config.js';

const logger = pino({
  level: Env.NODE_ENV === "development" ? "debug" : "info",
  transport:
    Env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
});

export default logger;
