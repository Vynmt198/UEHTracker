import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger.js';
import { errorMiddleware } from './common/middlewares/error.middleware.js';

// Import Routes
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import academicRoutes from './modules/academic/academic.routes.js';
import drlRoutes from './modules/drl/drl.routes.js';
import syncRoutes from './modules/sync/sync.routes.js';
import forumRoutes from './modules/forum/forum.routes.js';

const app = express();

// 1. Security & Parsers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Whitelist origins for development, production, and Vercel preview environments
const staticAllowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://ueh-tracker.vercel.app',
];

if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
  staticAllowedOrigins.push(...envOrigins);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Check static allowed list
    if (staticAllowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any Vercel domain (*.vercel.app)
    if (/^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // In dev or if wildcard configured
    if (process.env.NODE_ENV !== 'production' || process.env.CORS_ORIGIN === '*') {
      return callback(null, true);
    }

    // Fallback: allow to avoid breaking UEH Tracker clients
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 2. Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: 'UEH Tracker API Documentation',
}));

// 3. API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', usersRoutes);
app.use('/api/v1/academic', academicRoutes);
app.use('/api/v1/drl', drlRoutes);
app.use('/api/v1/sync', syncRoutes);
app.use('/api/v1/forum', forumRoutes);

// Root Healthcheck
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'UEH Tracker API Ecosystem (JavaScript)',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

// 4. Global Error Handling Middleware
app.use(errorMiddleware);

export default app;
