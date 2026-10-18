'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const { Pool } = require('pg');

const authRoutes = require('./routes/auth');
const secretsRoutes = require('./routes/secrets');
const secretsEnhancedRoutes = require('./routes/secretsEnhanced');
const foldersRoutes = require('./routes/folders');
const importExportRoutes = require('./routes/importExport');
const auditRoutes = require('./routes/audit');
const auditAdminRoutes = require('./routes/auditAdmin');
const samlRoutes = require('./routes/saml');

const { isSamlEnabled } = require('./config/saml');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Paramètres du service
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production';
const PORT = Number(process.env.PORT || 3001);

app.set('trust proxy', 1);

// Disponibilité PostgreSQL
const READINESS_DB_TIMEOUT_MS = Number(process.env.READINESS_DB_TIMEOUT_MS || 1500);

function buildDbConnectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // Construire la connexion depuis POSTGRES_* si DATABASE_URL manque.
  const host = process.env.POSTGRES_HOST || 'postgres';
  const port = process.env.POSTGRES_PORT || '5432';
  const db = process.env.POSTGRES_DB || 'postgres';
  const user = process.env.POSTGRES_USER || 'postgres';
  const pass = process.env.POSTGRES_PASSWORD || '';

  // Encodage explicite des identifiants dans l'URL.
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/${db}`;
}

const DB_DSN = buildDbConnectionString();

// Limiter les connexions pour des contrôles de santé légers.
const pgPool = new Pool({
  connectionString: DB_DSN,
  max: Number(process.env.PG_POOL_MAX || 3),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS || 10_000),
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT_MS || 1_000),
  ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

async function withTimeout(promise, ms, timeoutMessage) {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error(timeoutMessage)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(t);
  }
}

async function dbReadyCheck() {
  // Contrôler la connexion sans bloquer le serveur.
  const started = Date.now();
  const queryPromise = pgPool.query('SELECT 1 as ok');
  await withTimeout(queryPromise, READINESS_DB_TIMEOUT_MS, `DB readiness timeout after ${READINESS_DB_TIMEOUT_MS}ms`);
  return { latencyMs: Date.now() - started };
}

// En-têtes de sécurité
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: IS_PROD
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
  })
);

// Contrôle des origines
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://vault.freijstack.com',
  'https://vault-staging.freijstack.com',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl/postman
    if (allowedOrigins.includes(origin)) return callback(null, true);

    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Limitation du trafic
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
});
app.use('/api/', limiter);

// Décodage des requêtes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session et authentification SAML
if (isSamlEnabled()) {
  const sessionSecret = process.env.SESSION_SECRET || process.env.JWT_SECRET;
  if (!sessionSecret) {
    console.error('❌ SESSION_SECRET or JWT_SECRET must be set when SAML is enabled.');
    process.exit(1);
  }

  app.use(
    session({
      name: process.env.SESSION_COOKIE_NAME || 'securevault.sid',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        secure: IS_PROD,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  console.log('✅ SSO/SAML authentication enabled');
}

// Endpoints de santé
const buildHealthPayload = (status, extra = {}) => ({
  status,
  timestamp: new Date().toISOString(),
  service: 'securevault-backend',
  env: NODE_ENV,
  version: process.env.APP_VERSION || process.env.npm_package_version || '1.0.0',
  ...extra,
});

app.get(['/healthz', '/health', '/api/health'], (req, res) => {
  res.status(200).json(buildHealthPayload('healthy'));
});

// Readiness : SELECT 1 et délai limité pour PostgreSQL.
app.get('/readyz', async (req, res) => {
  try {
    const { latencyMs } = await dbReadyCheck();
    return res.status(200).json(
      buildHealthPayload('ready', {
        db: { ok: true, latencyMs },
      })
    );
  } catch (err) {
    console.error('❌ Readiness DB check failed:', err?.message || err);
    return res.status(503).json(
      buildHealthPayload('not-ready', {
        db: { ok: false, error: err?.message || 'DB check failed' },
      })
    );
  }
});

// Routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/secrets', secretsRoutes);
app.use('/api/secrets-pro', secretsEnhancedRoutes);
app.use('/api/folders', foldersRoutes);
app.use('/api/import-export', importExportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/audit/admin', auditAdminRoutes);

if (isSamlEnabled()) {
  app.use('/api/auth/saml', samlRoutes);
}

// Route inconnue
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Gestion des erreurs, enregistrée en dernier
app.use(errorHandler);

// Gestion des erreurs du processus
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔐 SecureVault Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(`🛡️  Security: Helmet, CORS, Rate Limiting enabled`);
  console.log(`🔑 SSO/SAML: ${isSamlEnabled() ? 'Enabled' : 'Disabled'}`);
  console.log(`🧪 Readiness DB timeout: ${READINESS_DB_TIMEOUT_MS}ms`);
});

module.exports = app;
