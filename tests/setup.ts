// Test setup for JuliaOS integration tests

// Mock environment variables for testing
process.env.USE_MOCK_AI_SERVICE = 'true';
process.env.JULIAOS_API_KEY = 'test-key';
process.env.JULIAOS_BASE_URL = 'https://api.juliaos.ai';
process.env.JULIAOS_AGENT_ID = 'test-agent';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};