const express = require('express');
const Joi = require('joi');
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { encrypt, decrypt } = require('../utils/crypto');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation schema
const secretSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  value: Joi.string().required(),
  description: Joi.string().max(500).allow('', null),
  expires_at: Joi.date().iso().allow(null)
});

/**
 * GET /api/secrets - List all secrets for user
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, name, description, expires_at, created_at, updated_at
       FROM secrets
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    
    await logAudit({
      userId: req.user.id,
      action: 'SECRETS_LISTED',
      resourceType: 'secret',
      details: { count: result.rows.length },
      req
    });
    
    res.json({
      secrets: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/secrets/:id - Get specific secret (decrypted)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, name, encrypted_value, iv, auth_tag, description, expires_at, created_at, updated_at
       FROM secrets
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Secret not found' });
    }
    
    const secret = result.rows[0];
    
    // Check expiration
    if (secret.expires_at && new Date(secret.expires_at) < new Date()) {
      return res.status(410).json({ 
        error: 'Secret has expired',
        expires_at: secret.expires_at
      });
    }
    
    // Decrypt value
    try {
      const decryptedValue = decrypt(
        secret.encrypted_value,
        secret.iv,
        secret.auth_tag
      );
      
      await logAudit({
        userId: req.user.id,
        action: 'SECRET_ACCESSED',
        resourceType: 'secret',
        resourceId: secret.id,
        details: { name: secret.name },
        req
      });
      
      res.json({
        id: secret.id,
        name: secret.name,
        value: decryptedValue,
        description: secret.description,
        expires_at: secret.expires_at,
        created_at: secret.created_at,
        updated_at: secret.updated_at
      });
    } catch (decryptError) {
      console.error('Decryption error:', decryptError);
      return res.status(500).json({ 
        error: 'Failed to decrypt secret',
        message: 'Encryption key may have changed'
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/secrets - Create new secret
 */
router.post('/', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = secretSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }
    
    const { name, value: plainValue, description, expires_at } = value;
    
    // Check for duplicate name
    const existing = await query(
      'SELECT id FROM secrets WHERE user_id = $1 AND name = $2',
      [req.user.id, name]
    );
    
    if (existing.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Secret with this name already exists'
      });
    }
    
    // Encrypt value
    const { encrypted, iv, authTag } = encrypt(plainValue);
    
    // Store secret
    const result = await query(
      `INSERT INTO secrets (user_id, name, encrypted_value, iv, auth_tag, description, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, description, expires_at, created_at`,
      [req.user.id, name, encrypted, iv, authTag, description, expires_at]
    );
    
    const secret = result.rows[0];
    
    await logAudit({
      userId: req.user.id,
      action: 'SECRET_CREATED',
      resourceType: 'secret',
      resourceId: secret.id,
      details: { name },
      req
    });
    
    res.status(201).json({
      message: 'Secret created successfully',
      secret
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/secrets/:id - Update secret
 */
router.put('/:id', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = secretSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }
    
    const { name, value: plainValue, description, expires_at } = value;
    
    // Check secret exists and belongs to user
    const existing = await query(
      'SELECT id FROM secrets WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Secret not found' });
    }
    
    // Encrypt new value
    const { encrypted, iv, authTag } = encrypt(plainValue);
    
    // Update secret
    const result = await query(
      `UPDATE secrets
       SET name = $1, encrypted_value = $2, iv = $3, auth_tag = $4,
           description = $5, expires_at = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING id, name, description, expires_at, updated_at`,
      [name, encrypted, iv, authTag, description, expires_at, req.params.id, req.user.id]
    );
    
    const secret = result.rows[0];
    
    await logAudit({
      userId: req.user.id,
      action: 'SECRET_UPDATED',
      resourceType: 'secret',
      resourceId: secret.id,
      details: { name },
      req
    });
    
    res.json({
      message: 'Secret updated successfully',
      secret
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/secrets/:id - Delete secret
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM secrets WHERE id = $1 AND user_id = $2 RETURNING name',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Secret not found' });
    }
    
    await logAudit({
      userId: req.user.id,
      action: 'SECRET_DELETED',
      resourceType: 'secret',
      resourceId: req.params.id,
      details: { name: result.rows[0].name },
      req
    });
    
    res.json({
      message: 'Secret deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
