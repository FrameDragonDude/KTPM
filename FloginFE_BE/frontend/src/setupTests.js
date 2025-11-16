import '@testing-library/jest-dom';

// Mock window.confirm
global.confirm = jest.fn(() => true);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
