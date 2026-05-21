import { GoogleGenAI } from "@google/genai";
import { Env } from './env.config.js';
import logger from '../utils/logger.js';

const API_KEY = Env.GEMINI_API_KEY;

if (!API_KEY) {
  logger.warn(
    "GEMINI_API_KEY is not defined. Google AI features will be disabled.",
  );
}

export const genAI = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
export const genAIModel = "gemini-2.0-flash";

export const isAIAvailable = !!genAI;
