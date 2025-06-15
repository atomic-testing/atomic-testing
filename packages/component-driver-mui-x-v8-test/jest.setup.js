// __tests__/jest.setup.js

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const errorSpy = jest.spyOn(console, 'error').mockImplementation(message => {
  if (typeof message === 'string' && !message.includes('MUI X: Missing license key')) {
    console.error(message);
  }
});

afterAll(() => {
  console.error.mockRestore();
});
