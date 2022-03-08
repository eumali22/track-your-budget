/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfigFile: 'tsconfig.json'
    }
  },
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: [
    '**/*.db.test.ts'
  ],
  testPathIgnorePatterns: [
    'libs', 'routes'
  ],
  testEnvironment: 'node'
};