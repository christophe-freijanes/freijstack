const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { query } = require('../config/database');
const { logAudit } = require('../middleware/audit');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

/**
 * POST /api/auth/register - Register new user
 */
router.post('/register', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }
    
    const { username, email, password } = value;
    
    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        error: 'User already exists'
      });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_ROUNDS) || 12
    );
    
    // Create user
    const result = await query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, username, email, role, created_at`,
      [username, email, passwordHash]
    );
    
    const user = result.rows[0];
    
    // Log audit
    await logAudit({
      userId: user.id,
      action: 'USER_REGISTERED',
      resourceType: 'user',
      resourceId: user.id,
      details: { username, email },
      req
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login - User login
 */
router.post('/login', async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }
    
    const { username, password } = value;
    
    // Find user
    const result = await query(
      'SELECT id, username, email, password_hash, role FROM users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid credentials'
      });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordValid) {
      await logAudit({
        userId: user.id,
        action: 'LOGIN_FAILED',
        resourceType: 'user',
        resourceId: user.id,
        details: { reason: 'Invalid password' },
        req
      });
      
      return res.status(401).json({ 
        error: 'Invalid credentials'
      });
    }
    
    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );
    
    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    // Log audit
    await logAudit({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      resourceType: 'user',
      resourceId: user.id,
      details: {},
      req
    });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
