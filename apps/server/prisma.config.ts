import { defineConfig } from 'prisma/config';

try {
  process.loadEnvFile();
} catch {
  // .env may not exist in CI or during generate
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});
