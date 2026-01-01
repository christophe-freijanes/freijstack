const jwt = require('jsonwebtoken');

/**
 * Authentication middleware - verify JWT token
 */
function authenticate(req, res, next) {
  try {
    // SECURITY: Read user-provided header (unavoidable for authentication)
    // The actual permission decision is controlled by server-side JWT verification
    const authHeader = req.headers.authorization;
    
    // VALIDATION LAYER 1: Check header presence and type
    // This validates user input before any trust decision
    if (!authHeader || typeof authHeader !== 'string') {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No token provided'
      });
    }
    
    // VALIDATION LAYER 2: Check format (Bearer token prefix)
    // This prevents processing of malformed tokens
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Invalid token format'
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer '
    
    // PERMISSION DECISION: JWT verification with server-side secret (CWE-807 safe)
    // The actual trust decision is made via cryptographic signature verification
    // using a server-controlled secret, not the user-provided header value itself
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Please login again'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Authentication failed'
      });
    }
    
    return res.status(500).json({ 
      error: 'Authentication error',
      message: error.message
    });
  }
}

/**
 * RBAC middleware - check user role
 * @param {Array} allowedRoles - Array of allowed roles
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required'
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
}

module.exports = {
  authenticate,
  authorize
};
