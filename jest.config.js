module.exports = {
  setupFiles: [
    '<rootDir>/tests/setup.ts'
  ],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  coverageDirectory: './coverage/',
  testEnvironment: 'jsdom',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  modulePathIgnorePatterns: ['tests/e2e/', '_theme/'],
  collectCoverageFrom: ['composables/**/*.ts'],
  testMatch: ['<rootDir>/tests/(unit|integration)/**/*spec.[jt]s?(x)'],
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/$1'
  }
};
