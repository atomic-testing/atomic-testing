// __tests__/jest.setup.js

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// ---- @mui/x-charts jsdom shims (see #904) ----
// Charts are e2e-primary: geometry (hover targets, tooltip positioning, text
// measurement) needs a real layout engine. These shims only make the charts
// RENDER under jsdom so the structural reads (legend, axis labels, data-point
// counts) stay portable; anything geometric is asserted e2e-only.

// jest's jsdom environment does not expose Node's structuredClone global,
// which @mui/x-charts calls while initializing its store. v8 serialization
// covers the same structured-clone semantics.
if (typeof global.structuredClone !== 'function') {
  const v8 = require('v8');
  global.structuredClone = value => v8.deserialize(v8.serialize(value));
}

// jsdom has no ResizeObserver; charts observe their container to size the
// drawing area. The example charts pass explicit width/height, so a silent
// no-op observer suffices.
if (typeof global.ResizeObserver !== 'function') {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom's SVG elements lack getBBox (charts measure axis/legend text with it).
// A zero-rect keeps rendering alive; real measurements are e2e-only.
if (typeof SVGElement !== 'undefined' && typeof SVGElement.prototype.getBBox !== 'function') {
  SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 });
}

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
