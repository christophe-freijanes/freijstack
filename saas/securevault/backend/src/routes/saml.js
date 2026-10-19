/**
 * SSO/SAML Authentication Routes
 * Handles authentication via SAML identity providers
 */

const express = require('express');
const passport = require('passport');
const { Strategy: SamlStrategy } = require('@node-saml/passport-saml');
const jwt = require('jsonwebtoken');
const { samlConfig, isSamlEnabled } = require('../config/saml');
const pool = require('../config/database');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

/**
 * Configure Passport SAML Strategy
 */
if (isSamlEnabled()) {
  const strategy = new SamlStrategy(
    {
      entryPoint: samlConfig.entryPoint,
      callbackUrl: samlConfig.callbackUrl,
      issuer: samlConfig.issuer,
      idpCert: samlConfig.cert,
      privateKey: samlConfig.privateKey,
      decryptionPvk: samlConfig.decryptionPvk,
      signatureAlgorithm: samlConfig.signatureAlgorithm,
      digestAlgorithm: samlConfig.digestAlgorithm,
      validateInResponseTo: samlConfig.validateInResponseTo,
      disableRequestedAuthnContext: samlConfig.disableRequestedAuthnContext,
      forceAuthn: samlConfig.forceAuthn,
    },
    async (profile, done) => {
      try {
        // Extract user information from SAML profile
        const email = profile[samlConfig.attributeMapping.email] || profile.email;
        const username = profile[samlConfig.attributeMapping.username] || profile.nameID;
        const firstName = profile[samlConfig.attributeMapping.firstName] || '';
        const lastName = profile[samlConfig.attributeMapping.lastName] || '';

        if (!email) {
          return done(new Error('Email not provided by identity provider'));
        }

        // Check if user exists
        let user = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
        );

        if (user.rows.length === 0) {
          // Auto-provision user from SAML
          const insertResult = await pool.query(
            `INSERT INTO users (username, email, password_hash, is_sso_user, sso_provider, created_at)
             VALUES ($1, $2, $3, true, 'saml', NOW())
             RETURNING id, username, email, is_sso_user, sso_provider`,
            [username, email, 'SSO_USER_NO_PASSWORD'] // No local password for SSO users
          );
          user = insertResult;

          // Log user creation
          await pool.query(
            `INSERT INTO audit_logs (user_id, action, resource, details, ip_address, created_at)
             VALUES ($1, 'user_created', 'user', $2, $3, NOW())`,
            [
              insertResult.rows[0].id,
              JSON.stringify({ method: 'saml', email, username }),
              'SSO',
            ]
          );
        } else {
          // Update last login
          await pool.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.rows[0].id]
          );
        }

        return done(null, user.rows[0]);
      } catch (error) {
        console.error('SAML authentication error:', error);
        return done(error);
      }
    },
    async (profile, done) => {
      try {
        const email = profile[samlConfig.attributeMapping.email] || profile.email;
        if (!email) return done(null, false);
        const result = await pool.query(
          'SELECT id, username, email, is_sso_user, sso_provider FROM users WHERE email = $1',
          [email]
        );
        return done(null, result.rows[0] || false);
      } catch (error) {
        return done(error);
      }
    }
  );

  passport.use('saml', strategy);

  // Serialize/deserialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      done(null, result.rows[0]);
    } catch (error) {
      done(error);
    }
  });
}

/**
 * GET /api/auth/saml/enabled
 * Check if SAML authentication is enabled
 */
router.get('/enabled', (req, res) => {
  res.json({
    enabled: isSamlEnabled(),
    provider: samlConfig.identityProviderName,
  });
});

/**
 * GET /api/auth/saml/metadata
 * Return SAML service provider metadata
 */
router.get('/metadata', (req, res) => {
  if (!isSamlEnabled()) {
    return res.status(503).json({ error: 'SAML not configured' });
  }

  try {
    const strategy = passport._strategy('saml');
    const metadata = strategy.generateServiceProviderMetadata(
      samlConfig.decryptionCert,
      samlConfig.signingCert
    );
    res.type('application/xml').send(metadata);
  } catch (error) {
    res.status(500).json({ error: 'Metadata generation failed' });
  }
});

/**
 * GET /api/auth/saml/login
 * Initiate SAML authentication
 */
router.get('/login', (req, res, next) => {
  if (!isSamlEnabled()) {
    return res.status(503).json({ error: 'SAML authentication not available' });
  }

  passport.authenticate('saml', {
    failureRedirect: '/login?error=saml',
    failureFlash: true,
  })(req, res, next);
});

/**
 * POST /api/auth/saml/callback
 * Handle SAML assertion from IdP
 */
router.post(
  '/callback',
  passport.authenticate('saml', {
    failureRedirect: '/login?error=saml_failed',
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
          isSsoUser: true,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // Log successful SSO login
      await logAudit(
        user.id,
        'sso_login',
        'auth',
        { provider: 'saml', email: user.email },
        req.ip
      );

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('SAML callback error:', error);
      res.redirect('/login?error=auth_failed');
    }
  }
);

/**
 * GET /api/auth/saml/logout
 * Initiate SAML logout
 */
router.get('/logout', (req, res) => {
  if (!isSamlEnabled()) {
    return res.json({ success: true });
  }

  const strategy = passport._strategy('saml');
  
  strategy.logout(req, (err, uri) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    
    // Clear session
    req.logout(() => {
      res.redirect(uri || '/');
    });
  });
});

module.exports = router;
