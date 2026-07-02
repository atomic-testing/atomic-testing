// A pure re-export of the Radix UI v1 drivers: shadcn/ui components are styled
// Radix primitives, so their DOM (and therefore their drivers) is identical.
// Re-exporting — rather than subclassing or copying — guarantees a single class
// identity per driver, so `instanceof` agrees across both package names.
// This package tracks component-driver-radix-v1's major version in lockstep.
export * from '@atomic-testing/component-driver-radix-v1';
