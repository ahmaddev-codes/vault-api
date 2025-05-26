module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.auth.js'],  testMatch: [
    '<rootDir>/tests/middlewares/authMiddleware.test.js'
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'middlewares/**/*.js',
    '!**/node_modules/**'
  ],
  coverageReporters: ['text'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
  detectOpenHandles: false,
  maxWorkers: 1,
  cache: false,
  watchman: false
};
