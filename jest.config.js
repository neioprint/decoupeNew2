module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    moduleFileExtensions: ['js'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    verbose: true,
    transformIgnorePatterns: [
        'node_modules/(?!(@your-project-name|other-esm-package)/)'
    ]
};
