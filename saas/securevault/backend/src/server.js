require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');

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
const PORT = process.env.PORT || 3001;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
}));

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://vault.freijstack.com',
  'https://vault-staging.freijstack.com'
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      callback(null, false); // Don't block, just don't allow credentials
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

// Explicitly handle OPTIONS for all routes
app.options('*', cors());

// Rate Limiting (skip OPTIONS for preflight)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS', // Don't rate limit CORS preflight
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session Configuration (required for SAML)
if (isSamlEnabled()) {
  app.use(session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  console.log('✅ SSO/SAML authentication enabled');
}

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'securevault-backend',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/secrets', secretsRoutes);
app.use('/api/secrets-pro', secretsEnhancedRoutes);
app.use('/api/folders', foldersRoutes);
app.use('/api/import-export', importExportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/audit/admin', auditAdminRoutes);

// SSO/SAML Routes (if enabled)
if (isSamlEnabled()) {
  app.use('/api/auth/saml', samlRoutes);
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Error Handler (must be last)
app.use(errorHandler);

  console.log(`🔑 SSO/SAML: ${isSamlEnabled() ? 'Enabled' : 'Disabled'}`);
// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔐 SecureVault Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🛡️  Security: Helmet, CORS, Rate Limiting enabled`);
});

module.exports = app;
