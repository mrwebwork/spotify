module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFiles: ['<rootDir>/tests/setup.js'],
};