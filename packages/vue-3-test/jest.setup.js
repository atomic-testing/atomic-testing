// Jest setup for Vue 3 testing
const Vue = require('vue');

// Make Vue available globally for @testing-library/vue and @vue/test-utils
global.Vue = Vue;

// Some testing libraries also expect these Vue modules to be global
try {
  const VueCompilerDOM = require('@vue/compiler-dom');
  global.VueCompilerDOM = VueCompilerDOM;
} catch (e) {
  // VueCompilerDOM is not always needed
}

try {
  const VueServerRenderer = require('@vue/server-renderer');
  global.VueServerRenderer = VueServerRenderer;
} catch (e) {
  // VueServerRenderer is not always needed for client-side tests
}