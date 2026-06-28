// __tests__/jest.setup.js

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Capture the real console.error BEFORE spying so the mock can delegate to it.
// Calling the spied `console.error` from inside the mock would recurse infinitely.
const originalConsoleError = console.error;
const errorSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
  const [message] = args;
  // Swallow the expected unlicensed-MUI-X warning; forward everything else verbatim.
  if (typeof message === 'string' && message.includes('MUI X: Missing license key')) {
    return;
  }
  originalConsoleError.apply(console, args);
});

afterAll(() => {
  errorSpy.mockRestore();
});
