import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const DEFAULT_DATABASE_URL =
  'postgresql://neondb_owner:npg_0xSWTFM4BUkm@ep-spring-rain-b3fptiyr-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const DEFAULT_DIRECT_URL =
  'postgresql://neondb_owner:npg_0xSWTFM4BUkm@ep-spring-rain-b3fptiyr.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

/**
 * Chuẩn hóa chuỗi kết nối Database URL:
 * Tự động loại bỏ dấu ngoặc kép / nháy đơn thừa (khi copy paste từ file .env vào dashboard đám mây như Render/Vercel)
 * và đảm bảo luôn có URL hợp lệ kết nối tới Neon PostgreSQL Cloud.
 */
function sanitizeDbUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let cleaned = rawUrl.trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

let activeDatabaseUrl = sanitizeDbUrl(process.env.DATABASE_URL);
if (!activeDatabaseUrl || (!activeDatabaseUrl.startsWith('postgresql://') && !activeDatabaseUrl.startsWith('postgres://'))) {
  console.warn('[Prisma] DATABASE_URL không hợp lệ hoặc thiếu trong môi trường, đang dùng cấu hình Neon Cloud production.');
  activeDatabaseUrl = DEFAULT_DATABASE_URL;
}

let activeDirectUrl = sanitizeDbUrl(process.env.DIRECT_URL);
if (!activeDirectUrl || (!activeDirectUrl.startsWith('postgresql://') && !activeDirectUrl.startsWith('postgres://'))) {
  activeDirectUrl = DEFAULT_DIRECT_URL;
}

// Cập nhật lại process.env để Prisma schema validation không bị lỗi
process.env.DATABASE_URL = activeDatabaseUrl;
process.env.DIRECT_URL = activeDirectUrl;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: activeDatabaseUrl,
    },
  },
});

export default prisma;
