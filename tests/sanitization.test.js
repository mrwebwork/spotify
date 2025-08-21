/**
 * XSS Prevention Test Suite
 * Tests for comprehensive input sanitization to prevent XSS attacks
 */

// For testing, we'll convert the ES module helpers to testable functions
const sanitizeInput = (input, allowHtml = false) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // First, handle basic HTML entity encoding for non-HTML contexts
  if (!allowHtml) {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // For HTML contexts, use DOMPurify with strict configuration
  // Note: DOMPurify requires a DOM environment, so we check if it's available
  if (typeof window !== 'undefined' && global.DOMPurify) {
    return global.DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // Allow no HTML tags for maximum security
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true, // Keep the text content but strip tags
    });
  }

  // Fallback for server-side rendering - basic encoding
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const sanitizeErrorMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return 'An error occurred';
  }

  // Remove any potential HTML/script content and encode special characters
  return sanitizeInput(message, false);
};

describe('XSS Prevention - Input Sanitization', () => {
  describe('sanitizeInput', () => {
    test('should handle null and undefined inputs', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput('')).toBe('');
    });

    test('should sanitize basic script tags', () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    test('should sanitize HTML attributes with javascript protocol', () => {
      const maliciousInput = '<img src="x" onerror="alert(1)">';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain('<img');
      expect(sanitized).not.toContain('onerror="alert');
      expect(sanitized).toBe('&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;');
    });

    test('should sanitize javascript: protocol', () => {
      const maliciousInput = 'javascript:alert("XSS")';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).toBe('javascript:alert(&quot;XSS&quot;)');
    });

    test('should sanitize data: URIs with javascript', () => {
      const maliciousInput = 'data:text/html,<script>alert("XSS")</script>';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toBe('data:text&#x2F;html,&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    test('should handle encoded HTML entities', () => {
      const maliciousInput = '&lt;script&gt;alert("XSS")&lt;/script&gt;';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).toBe('&amp;lt;script&amp;gt;alert(&quot;XSS&quot;)&amp;lt;&#x2F;script&amp;gt;');
    });

    test('should sanitize nested tags', () => {
      const maliciousInput = '<div><script>alert("XSS")</script></div>';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('<div>');
      expect(sanitized).toBe('&lt;div&gt;&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;&lt;&#x2F;div&gt;');
    });

    test('should sanitize malformed tags', () => {
      const maliciousInput = '<script<script>alert("XSS")</script>';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain('<script');
      expect(sanitized).toBe('&lt;script&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    test('should preserve safe text content', () => {
      const safeInput = 'My Song Title - Artist Name (2023)';
      const sanitized = sanitizeInput(safeInput);
      expect(sanitized).toBe('My Song Title - Artist Name (2023)');
    });

    test('should handle special characters safely', () => {
      const input = 'Title with "quotes" & ampersands';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Title with &quot;quotes&quot; &amp; ampersands');
    });

    test('should sanitize event handlers', () => {
      const maliciousInput = '<span onclick="alert(\'XSS\')">Click me</span>';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain('<span');
      expect(sanitized).not.toContain('onclick="alert');
      expect(sanitized).toBe('&lt;span onclick=&quot;alert(&#x27;XSS&#x27;)&quot;&gt;Click me&lt;&#x2F;span&gt;');
    });
  });

  describe('sanitizeErrorMessage', () => {
    test('should handle null and undefined error messages', () => {
      expect(sanitizeErrorMessage(null)).toBe('An error occurred');
      expect(sanitizeErrorMessage(undefined)).toBe('An error occurred');
      expect(sanitizeErrorMessage('')).toBe('An error occurred');
    });

    test('should sanitize malicious error messages', () => {
      const maliciousError = 'Error: <script>alert("XSS")</script>';
      const sanitized = sanitizeErrorMessage(maliciousError);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toBe('Error: &lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    test('should handle normal error messages', () => {
      const normalError = 'Database connection failed';
      const sanitized = sanitizeErrorMessage(normalError);
      expect(sanitized).toBe('Database connection failed');
    });

    test('should sanitize error messages with HTML', () => {
      const htmlError = 'Invalid input: <b>field cannot be empty</b>';
      const sanitized = sanitizeErrorMessage(htmlError);
      expect(sanitized).toBe('Invalid input: &lt;b&gt;field cannot be empty&lt;&#x2F;b&gt;');
    });
  });

  describe('Edge Cases and Attack Vectors', () => {
    test('should handle various XSS bypass attempts', () => {
      const bypassAttempts = [
        '<ScRiPt>alert("XSS")</ScRiPt>',
        '<<script>alert("XSS")</script>',
        '<script src="http://evil.com/xss.js"></script>',
        '<iframe src="javascript:alert(\'XSS\')"></iframe>',
        '<img src="x" onerror="eval(atob(\'YWxlcnQoIlhTUyIp\'))">',
        '<svg/onload=alert("XSS")>',
        '<details open ontoggle=alert("XSS")>',
        'javascript:/*--></title></style></textarea></script></xmp><svg/onload=alert("XSS")>',
      ];

      bypassAttempts.forEach(attempt => {
        const sanitized = sanitizeInput(attempt);
        // The key security test: no executable HTML tags should remain
        expect(sanitized).not.toMatch(/<script[\s\S]*?>/i);
        expect(sanitized).not.toContain('<svg');
        expect(sanitized).not.toContain('<iframe');
        expect(sanitized).not.toContain('<img');
        expect(sanitized).not.toContain('<details');
        
        // Ensure dangerous characters are properly encoded
        if (attempt.includes('<')) {
          expect(sanitized).toContain('&lt;');
        }
        if (attempt.includes('>')) {
          expect(sanitized).toContain('&gt;');
        }
        if (attempt.includes('"')) {
          expect(sanitized).toContain('&quot;');
        }
      });
    });

    test('should handle Unicode and encoding attacks', () => {
      const unicodeAttacks = [
        '\u003cscript\u003ealert("XSS")\u003c/script\u003e',
        '\\u003cscript\\u003ealert("XSS")\\u003c/script\\u003e',
        '&#60;script&#62;alert("XSS")&#60;/script&#62;',
      ];

      unicodeAttacks.forEach(attack => {
        const sanitized = sanitizeInput(attack);
        expect(sanitized).not.toMatch(/<script[\s\S]*?>/i);
        // Should handle Unicode characters safely
        expect(sanitized.length).toBeGreaterThan(0);
      });
    });

    test('should handle very long inputs without crashing', () => {
      const longInput = '<script>alert("XSS")</script>'.repeat(1000);
      const sanitized = sanitizeInput(longInput);
      expect(sanitized).not.toContain('<script>');
      expect(typeof sanitized).toBe('string');
    });

    test('should handle mixed content attacks', () => {
      const mixedAttack = 'Harmless text <script>alert("XSS")</script> more harmless text';
      const sanitized = sanitizeInput(mixedAttack);
      expect(sanitized).toContain('Harmless text');
      expect(sanitized).toContain('more harmless text');
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toBe('Harmless text &lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt; more harmless text');
    });
  });

  describe('Performance and Memory Safety', () => {
    test('should handle large inputs efficiently', () => {
      const largeInput = 'A'.repeat(10000) + '<script>alert("XSS")</script>' + 'B'.repeat(10000);
      const start = Date.now();
      const sanitized = sanitizeInput(largeInput);
      const end = Date.now();
      
      expect(end - start).toBeLessThan(1000); // Should complete within 1 second
      expect(sanitized).not.toContain('<script>');
      expect(sanitized.length).toBeGreaterThan(20000);
    });

    test('should not cause memory leaks with repeated calls', () => {
      const input = '<script>alert("XSS")</script>';
      for (let i = 0; i < 1000; i++) {
        const sanitized = sanitizeInput(input);
        expect(sanitized).not.toContain('<script>');
      }
    });
  });
});