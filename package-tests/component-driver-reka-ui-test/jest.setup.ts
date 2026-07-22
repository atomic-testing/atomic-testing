// jsdom polyfills for Reka UI, added here (test-package-local) rather than as
// driver-level workarounds if any gap surfaces — mirroring the precedent set
// by component-driver-radix-test/jest.setup.ts and
// component-driver-primevue-test/jest.setup.ts. None of the primitives this
// package currently covers (Separator, Switch, Checkbox, Toggle) touch a
// jsdom-unimplemented browser API — verified by their DOM tests running clean
// with no polyfills — so this file is currently empty. Add a stub here,
// documented the same way, the moment a future primitive needs one.

export {};
