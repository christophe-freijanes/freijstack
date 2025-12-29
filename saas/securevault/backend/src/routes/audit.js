const express = require('express');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/audit - Get audit logs for current user
 */
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await query(
      `SELECT id, action, resource_type, resource_id, details, ip_address, timestamp
       FROM audit_logs
       WHERE user_id = $1
       ORDER BY timestamp DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );
    
    const countResult = await query(
      'SELECT COUNT(*) FROM audit_logs WHERE user_id = $1',
      [req.user.id]
    );
    
    res.json({
      logs: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/audit/all - Get all audit logs (admin only)
 */
router.get('/all', authorize('admin'), async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await query(
      `SELECT al.id, al.user_id, u.username, al.action, al.resource_type,
              al.resource_id, al.details, al.ip_address, al.timestamp
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.timestamp DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM audit_logs');
    
    res.json({
      logs: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
