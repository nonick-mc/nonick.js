import { defineConfig } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';
 
const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  dialect: 'postgresql',
  out: './src/lib/database/drizzle',
  schema: './src/lib/database/src/schema',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
