module.exports = {
  rootDir: '../',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: [
    '<rootDir>/src/modules/contactform/.*',
    '.*\\.integration\\.spec\\.ts',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
