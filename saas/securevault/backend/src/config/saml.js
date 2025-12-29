/**
 * SAML Configuration for SSO Integration
 * Supports multiple identity providers (Okta, Azure AD, Google Workspace, etc.)
 */

const fs = require('fs');
const path = require('path');

const samlConfig = {
  // Entry point where SAML assertions are sent
  entryPoint: process.env.SAML_ENTRY_POINT || 'https://idp.example.com/sso/saml',
  
  // Callback URL where the IdP sends the response
  callbackUrl: process.env.SAML_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/saml/callback`,
  
  // Issuer / Entity ID
  issuer: process.env.SAML_ISSUER || 'securevault',
  
  // Certificate for validating SAML assertions (from IdP)
  cert: process.env.SAML_CERT || null,
  
  // Private key for signing SAML requests (optional)
  privateKey: process.env.SAML_PRIVATE_KEY || null,
  
  // Public certificate for encrypting SAML assertions (optional)
  decryptionPvk: process.env.SAML_DECRYPTION_KEY || null,
  
  // Identity provider name (for display)
  identityProviderName: process.env.SAML_IDP_NAME || 'SSO Provider',
  
  // Additional configuration
  signatureAlgorithm: 'sha256',
  digestAlgorithm: 'sha256',
  
  // Attribute mapping from SAML to user profile
  attributeMapping: {
    email: process.env.SAML_ATTR_EMAIL || 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    username: process.env.SAML_ATTR_USERNAME || 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    firstName: process.env.SAML_ATTR_FIRSTNAME || 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
    lastName: process.env.SAML_ATTR_LASTNAME || 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
  },
  
  // Validation options
  validateInResponseTo: true,
  disableRequestedAuthnContext: false,
  forceAuthn: false,
  
  // Session timeout (in minutes)
  sessionTimeout: parseInt(process.env.SAML_SESSION_TIMEOUT) || 480, // 8 hours
};

/**
 * Load certificate from file if path is provided
 */
if (process.env.SAML_CERT_PATH) {
  try {
    const certPath = path.resolve(process.cwd(), process.env.SAML_CERT_PATH);
    samlConfig.cert = fs.readFileSync(certPath, 'utf-8');
  } catch (error) {
    console.error('Failed to load SAML certificate:', error.message);
  }
}

/**
 * Validate SAML configuration
 */
const validateSamlConfig = () => {
  const required = ['entryPoint', 'callbackUrl', 'issuer'];
  const missing = required.filter(field => !samlConfig[field]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  SAML configuration incomplete. Missing: ${missing.join(', ')}`);
    console.warn('   SSO/SAML authentication will be disabled.');
    return false;
  }
  
  if (!samlConfig.cert) {
    console.warn('⚠️  SAML certificate not configured. Cannot validate assertions.');
    return false;
  }
  
  return true;
};

/**
 * Check if SAML is enabled
 */
const isSamlEnabled = () => {
  return process.env.SAML_ENABLED === 'true' && validateSamlConfig();
};

module.exports = {
  samlConfig,
  validateSamlConfig,
  isSamlEnabled,
};
