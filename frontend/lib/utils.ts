import { LogLevel, LogOptions } from "@/types/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }
  return null;
}

const IS_DEV = process.env.NODE_ENV === "development";

export const logger = {
  private_log(
    level: LogLevel,
    message: string,
    metadata?: unknown,
    options?: LogOptions,
  ) {
    const { module = "SYSTEM", forceProd = false } = options || {};

    if (!IS_DEV && !forceProd && level !== "error" && level !== "warn") {
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${module}]`;

    let formattedMetadata = metadata;
    if (metadata instanceof Error) {
      formattedMetadata = {
        message: metadata.message,
        stack: metadata.stack,
        name: metadata.name,
      };
    }

    const args: unknown[] = [prefix + " " + message];
    if (formattedMetadata !== undefined) args.push(formattedMetadata);

    switch (level) {
      case "debug":
        console.debug(...args);
        break;
      case "info":
        console.info(...args);
        break;
      case "warn":
        console.warn(...args);
        break;
      case "error":
        console.error(...args);
        break;
    }
  },

  debug(message: string, metadata?: unknown, options?: LogOptions) {
    this.private_log("debug", message, metadata, options);
  },

  info(message: string, metadata?: unknown, options?: LogOptions) {
    this.private_log("info", message, metadata, options);
  },

  success(message: string, metadata?: unknown, options?: LogOptions) {
    this.private_log("info", `✅ ${message}`, metadata, {
      ...options,
      module: options?.module || "SUCCESS",
    });
  },

  warn(message: string, metadata?: unknown, options?: LogOptions) {
    this.private_log("warn", `⚠️ ${message}`, metadata, options);
  },

  error(message: string, metadata?: unknown, options?: LogOptions) {
    this.private_log("error", `🚨 ${message}`, metadata, options);
  },
};
