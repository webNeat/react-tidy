module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./testsSetup.ts'],
  coverageDirectory: './coverage',
  coverageReporters: ['lcov'],
}
