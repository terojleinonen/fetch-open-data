// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // if you create this file
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel', '@babel/preset-react'] }],
  },
  moduleNameMapper: {
    // Handle CSS imports (if any)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mock next/font
    '^next/font/local$': '<rootDir>/__mocks__/nextFontMock.js',
    '^next/font/google$': '<rootDir>/__mocks__/nextFontMock.js',
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
