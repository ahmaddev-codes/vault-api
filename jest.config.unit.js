module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.mock.js'],  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js',
    '<rootDir>/tests/controllers/**/*.test.js',
    '<rootDir>/tests/middlewares/**/*.unit.test.js'
    // Exclude tests/utils/generateToken.test.js as it needs real JWT
    // Exclude tests/middlewares/authMiddleware.test.js as it needs real JWT
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middlewares/**/*.js',
    'utils/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**'
  ],
  coverageReporters: ['text', 'text-summary'],
  verbose: false,
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
