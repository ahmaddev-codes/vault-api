module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.lite.js'],  testMatch: [
    '<rootDir>/tests/utils/**/*.test.js'
  ],
  coverageDirectory: '<rootDir>/coverage',  collectCoverageFrom: [
    'utils/**/*.js',
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
