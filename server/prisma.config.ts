import { defineConfig } from '@prisma/config';
import 'dotenv/config'; // This handles the config() call automatically

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});