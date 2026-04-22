import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

// 1. Configure WebSockets for Node.js (Critical for local dev)
if (typeof globalThis.EdgeRuntime !== "string") {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is missing from .env file");
}

// 2. Setup Neon Connection Pool
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

// 3. Initialize Prisma Client with the Adapter
// Note: We do NOT pass 'url' here in Prisma 7 when using an adapter
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'], // Useful for debugging your TrustFlow queries
  });

// 4. Prevent multiple instances in development (Fast Refresh fix)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;