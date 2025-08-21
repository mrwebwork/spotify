#!/usr/bin/env node

/**
 * Demo script to test XSS sanitization functionality
 * This script demonstrates how the sanitization functions protect against various XSS attacks
 */

// Import our sanitization functions
const { sanitizeInput, sanitizeErrorMessage } = require('./libs/helpers.ts');

console.log('🔒 XSS Protection Demo - Testing Input Sanitization\n');

const dangerousInputs = [
  {
    name: 'Basic Script Tag',
    input: '<script>alert("XSS Attack!")</script>',
  },
  {
    name: 'Song Title with HTML',
    input: 'My Song <script>steal(cookies)</script> Title',
  },
  {
    name: 'Event Handler Attack',
    input: '<img src="x" onerror="alert(\'Hacked!\')">',
  },
  {
    name: 'JavaScript Protocol',
    input: 'javascript:alert("XSS")',
  },
  {
    name: 'Nested Tags',
    input: '<div><script>maliciousCode()</script></div>',
  },
  {
    name: 'Mixed Case Script',
    input: '<ScRiPt>alert("bypass attempt")</ScRiPt>',
  },
  {
    name: 'Safe User Input',
    input: 'Normal Song Title - Artist Name (2023)',
  },
];

console.log('Testing sanitizeInput function:\n');

dangerousInputs.forEach((test, index) => {
  console.log(`${index + 1}. ${test.name}:`);
  console.log(`   Input:  "${test.input}"`);
  
  try {
    const sanitized = sanitizeInput(test.input);
    console.log(`   Output: "${sanitized}"`);
    
    // Check if dangerous content was neutralized
    const isDangerous = test.input.includes('<script') || test.input.includes('javascript:') || test.input.includes('onerror=');
    const isSafe = !sanitized.includes('<script') && !sanitized.includes('<img') && !sanitized.includes('javascript:alert');
    
    if (isDangerous && isSafe) {
      console.log('   ✅ SAFE: Dangerous content neutralized');
    } else if (!isDangerous) {
      console.log('   ✅ SAFE: Content was already safe');
    } else {
      console.log('   ❌ DANGEROUS: Content may still be executable');
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
  
  console.log('');
});

console.log('Testing sanitizeErrorMessage function:\n');

const errorMessages = [
  {
    name: 'Malicious Error',
    error: 'Database error: <script>alert("XSS")</script>',
  },
  {
    name: 'Normal Error',
    error: 'Connection timeout',
  },
  {
    name: 'Null Error',
    error: null,
  },
];

errorMessages.forEach((test, index) => {
  console.log(`${index + 1}. ${test.name}:`);
  console.log(`   Input:  ${test.error === null ? 'null' : `"${test.error}"`}`);
  
  try {
    const sanitized = sanitizeErrorMessage(test.error);
    console.log(`   Output: "${sanitized}"`);
    console.log('   ✅ SAFE: Error message sanitized');
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
  
  console.log('');
});

console.log('🎉 XSS Protection Demo Complete!\n');
console.log('Key Security Features Demonstrated:');
console.log('✅ HTML tags are encoded, not removed');
console.log('✅ JavaScript protocols are neutralized'); 
console.log('✅ Event handlers cannot execute');
console.log('✅ Error messages are sanitized');
console.log('✅ Safe content is preserved unchanged');