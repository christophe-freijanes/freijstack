/**
 * RBAC Permission Checking Middleware
 * Verifies user has required permission based on role
 */

const pool = require('../config/database');

/**
 * Check if user has permission for an action on a resource
 * @param {string} resource - Resource type (secrets, users, settings, audit, etc.)
 * @param {string} action - Action type (read, write, delete, share)
 */
const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      // Bypass for SSO users if they're admins (during transition)
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get user's role and permissions
      const result = await pool.query(
        `SELECT r.permissions
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.id = $1`,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'No role assigned to user'
        });
      }

      const permissions = result.rows[0].permissions;

      // Check if user has permission
      if (
        permissions[resource] &&
        permissions[resource].includes(action)
      ) {
        // Permission granted
        return next();
      }

      // Permission denied
      return res.status(403).json({
        error: 'Access denied',
        message: `You don't have ${action} permission on ${resource}`,
        required: `${resource}:${action}`,
        userPermissions: permissions
      });

    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ 
        error: 'Permission check failed',
        message: error.message
      });
    }
  };
};

/**
 * Check if user has admin role
 */
const isAdmin = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT r.name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length > 0 && result.rows[0].name === 'admin') {
      return next();
    }

    return res.status(403).json({
      error: 'Access denied',
      message: 'Admin role required'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Authorization check failed' });
  }
};

/**
 * Check if user can access a specific secret
 * (owner or has been shared with)
 */
const canAccessSecret = async (req, res, next) => {
  try {
    const secretId = req.params.id || req.params.secretId;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT s.id
       FROM secrets s
       LEFT JOIN secret_shares ss ON s.id = ss.secret_id AND ss.shared_with = $2
       WHERE s.id = $1 AND (s.user_id = $2 OR ss.shared_with = $2)`,
      [secretId, userId]
    );

    if (result.rows.length > 0) {
      return next();
    }

    return res.status(404).json({
      error: 'Secret not found or access denied'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Access check failed' });
  }
};

module.exports = {
  checkPermission,
  isAdmin,
  canAccessSecret
};
