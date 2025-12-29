const { query } = require('../config/database');

/**
 * Log audit event
 * @param {object} options - Audit log options
 */
async function logAudit({ userId, action, resourceType, resourceId, details, req }) {
  try {
    const ipAddress = req?.ip || req?.connection?.remoteAddress || null;
    const userAgent = req?.get('user-agent') || null;
    
    await query(
      `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, action, resourceType, resourceId, JSON.stringify(details), ipAddress, userAgent]
    );
    
    console.log(`📝 Audit: ${action} by user ${userId}`);
  } catch (error) {
    console.error('❌ Audit logging error:', error.message);
    // Don't throw - audit failure shouldn't break main operation
  }
}

module.exports = {
  logAudit
};
