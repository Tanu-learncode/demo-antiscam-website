import 'dotenv/config';
import { defineConfig } from '@prisma/config';

// Use `any` to avoid TypeScript type errors while preserving runtime shape
const runtimeConfig: any = {
  datasources: {
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL,
      shadowDatabaseUrl: process.env.DIRECT_URL,
    },
  },
};

export default defineConfig(runtimeConfig);
