module.exports = {
  rootDir: '../',
  testMatch: ['<rootDir>/src/**/*.integration.spec.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
