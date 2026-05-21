import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { Env } from '../configs/env.config.js';

neonConfig.webSocketConstructor = ws;
const connectionString = `${Env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (Env.NODE_ENV !== "PRODUCTION") globalThis.prismaGlobal = prisma;

export default prisma;
