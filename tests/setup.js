// Jest setup file
// Mock DOMPurify for testing environment
global.DOMPurify = {
  sanitize: (input) => input // Simple mock for testing - in real app DOMPurify will handle this
};