/**
 * Enhanced Audit Routes for Administrators
 * Advanced filtering, search, and analytics
 */

const express = require('express');
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/audit/logs
 * Get audit logs with advanced filtering
 * Admin only
 */
router.get('/logs', checkPermission('audit', 'read'), async (req, res, next) => {
  try {
    const {
      userId,
      action,
      resourceType,
      dateFrom,
      dateTo,
      riskLevel,
      ipAddress,
      search,
      limit = 100,
      offset = 0
    } = req.query;

    let whereClause = [];
    let params = [];
    let paramIndex = 1;

    // Build dynamic WHERE clause
    if (userId) {
      whereClause.push(`al.user_id = $${paramIndex++}`);
      params.push(userId);
    }

    if (action) {
      whereClause.push(`al.action = $${paramIndex++}`);
      params.push(action);
    }

    if (resourceType) {
      whereClause.push(`al.resource = $${paramIndex++}`);
      params.push(resourceType);
    }

    if (dateFrom) {
      whereClause.push(`al.created_at >= $${paramIndex++}`);
      params.push(dateFrom);
    }

    if (dateTo) {
      whereClause.push(`al.created_at <= $${paramIndex++}`);
      params.push(dateTo);
    }

    if (riskLevel) {
      whereClause.push(`al.risk_level = $${paramIndex++}`);
      params.push(riskLevel);
    }

    if (ipAddress) {
      whereClause.push(`al.ip_address = $${paramIndex++}`);
      params.push(ipAddress);
    }

    if (search) {
      whereClause.push(`(u.username ILIKE $${paramIndex} OR al.details::text ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const where = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    // Get logs with user info
    const logsQuery = `
      SELECT 
        al.id,
        al.user_id,
        u.username,
        u.email,
        al.action,
        al.resource,
        al.details,
        al.ip_address,
        al.user_agent,
        al.risk_level,
        al.metadata,
        al.created_at
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ${where}
      ORDER BY al.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(logsQuery, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) 
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ${where}
    `;
    const countResult = await pool.query(countQuery, params.slice(0, -2));

    res.json({
      logs: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/audit/stats
 * Get audit statistics and analytics
 * Admin only
 */
router.get('/stats', checkPermission('audit', 'read'), async (req, res, next) => {
  try {
    const { days = 30 } = req.query;

    // Total actions by type
    const actionStats = await pool.query(`
      SELECT action, COUNT(*) as count
      FROM audit_logs
      WHERE created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      GROUP BY action
      ORDER BY count DESC
    `);

    // Most active users
    const activeUsers = await pool.query(`
      SELECT 
        u.username,
        u.email,
        COUNT(al.id) as action_count
      FROM audit_logs al
      JOIN users u ON al.user_id = u.id
      WHERE al.created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      GROUP BY u.id, u.username, u.email
      ORDER BY action_count DESC
      LIMIT 10
    `);

    // Actions over time (daily)
    const timeline = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM audit_logs
      WHERE created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Risk level distribution
    const riskDistribution = await pool.query(`
      SELECT 
        COALESCE(risk_level, 'unclassified') as risk_level,
        COUNT(*) as count
      FROM audit_logs
      WHERE created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      GROUP BY risk_level
    `);

    // Failed login attempts
    const failedLogins = await pool.query(`
      SELECT 
        ip_address,
        COUNT(*) as attempts,
        MAX(created_at) as last_attempt
      FROM audit_logs
      WHERE action = 'login_failed'
        AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      GROUP BY ip_address
      HAVING COUNT(*) > 3
      ORDER BY attempts DESC
    `);

    res.json({
      period: `${days} days`,
      actionStats: actionStats.rows,
      activeUsers: activeUsers.rows,
      timeline: timeline.rows,
      riskDistribution: riskDistribution.rows,
      suspiciousActivity: {
        failedLogins: failedLogins.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/audit/user/:userId
 * Get audit logs for a specific user
 * Admin only
 */
router.get('/user/:userId', checkPermission('audit', 'read'), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT 
        al.id,
        al.action,
        al.resource,
        al.details,
        al.ip_address,
        al.user_agent,
        al.risk_level,
        al.created_at
      FROM audit_logs al
      WHERE al.user_id = $1
      ORDER BY al.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM audit_logs WHERE user_id = $1',
      [userId]
    );

    // Get user info
    const userResult = await pool.query(
      'SELECT username, email FROM users WHERE id = $1',
      [userId]
    );

    res.json({
      user: userResult.rows[0],
      logs: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/audit/actions
 * Get list of all action types
 * Admin only
 */
router.get('/actions', checkPermission('audit', 'read'), async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT action, COUNT(*) as count
      FROM audit_logs
      GROUP BY action
      ORDER BY count DESC
    `);

    res.json({
      actions: result.rows
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/audit/export
 * Export audit logs to CSV
 * Admin only
 */
router.get('/export', checkPermission('audit', 'read'), async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req.query;

    let whereClause = '';
    const params = [];

    if (dateFrom && dateTo) {
      whereClause = 'WHERE al.created_at BETWEEN $1 AND $2';
      params.push(dateFrom, dateTo);
    }

    const result = await pool.query(`
      SELECT 
        al.id,
        al.created_at,
        u.username,
        u.email,
        al.action,
        al.resource,
        al.ip_address,
        al.details
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ${whereClause}
      ORDER BY al.created_at DESC
    `, params);

    // Convert to CSV
    const headers = ['ID', 'Date', 'Username', 'Email', 'Action', 'Resource', 'IP Address', 'Details'];
    const csvRows = [headers.join(',')];

    result.rows.forEach(row => {
      const values = [
        row.id,
        row.created_at,
        row.username || 'N/A',
        row.email || 'N/A',
        row.action,
        row.resource || 'N/A',
        row.ip_address || 'N/A',
        JSON.stringify(row.details || {}).replace(/"/g, '""')
      ];
      csvRows.push(values.map(v => `"${v}"`).join(','));
    });

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/audit/cleanup
 * Clean old audit logs (older than retention period)
 * Admin only
 */
router.delete('/cleanup', checkPermission('settings', 'write'), async (req, res, next) => {
  try {
    const { retentionDays = 90 } = req.body;

    const result = await pool.query(
      `DELETE FROM audit_logs 
       WHERE created_at < NOW() - INTERVAL '${parseInt(retentionDays)} days'
       RETURNING id`
    );

    res.json({
      success: true,
      deletedCount: result.rowCount,
      message: `Deleted audit logs older than ${retentionDays} days`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
