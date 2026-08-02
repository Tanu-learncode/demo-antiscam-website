import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasources: {
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL,
      // Use DIRECT_URL as shadowDatabaseUrl for migrations (session-mode pooler)
      shadowDatabaseUrl: process.env.DIRECT_URL,
    },
  },
});
