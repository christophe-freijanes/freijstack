const { samlConfig } = require('../src/config/saml');

test('SAML requires request correlation and SHA-256 signatures', () => {
  expect(samlConfig.validateInResponseTo).toBe('always');
  expect(samlConfig.signatureAlgorithm).toBe('sha256');
  expect(samlConfig.digestAlgorithm).toBe('sha256');
});
