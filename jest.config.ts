/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    roots: ['<rootDir>/src'],
    modulePaths: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts', '**/*.spec.ts'],
    moduleNameMapper: {
        '^@data/(.*)': '<rootDir>/src/data/$1',
        '^@domain/(.*)': '<rootDir>/src/domain/$1',
        '^@main/(.*)': '<rootDir>/src/main/$1',
        '^@infra/(.*)': '<rootDir>/src/infra/$1',
        '^@presentation/(.*)': '<rootDir>/src/presentation/$1',
        '^@validations/(.*)': '<rootDir>/src/validations/$1',
    },
};

export default config;
