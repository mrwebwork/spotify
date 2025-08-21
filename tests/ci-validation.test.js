/**
 * Basic function tests for CI/CD validation
 */

// Import functions we need to test exist
const { validateUuid, sanitizeInput } = require('../libs/helpers');

describe('Core Functions Availability', () => {
  test('validateUuid should be available and functional', () => {
    expect(typeof validateUuid).toBe('function');
    expect(validateUuid('test-uuid')).toBe('test-uuid');
    expect(() => validateUuid(null)).toThrow('Invalid UUID');
  });

  test('sanitizeInput should be available and functional', () => {
    expect(typeof sanitizeInput).toBe('function');
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(sanitizeInput(null)).toBe('');
  });
});

describe('CI/CD Environment Validation', () => {
  test('Node.js version should be supported', () => {
    const version = process.version;
    expect(version).toMatch(/^v(20|22)\./);
  });

  test('Required packages should be available', () => {
    expect(() => require('react')).not.toThrow();
    expect(() => require('next')).not.toThrow();
    expect(() => require('@supabase/supabase-js')).not.toThrow();
  });
});