# @atomic-testing/angular-21

Adapter for integrating [Atomic Testing](https://atomic-testing.dev) with
[Angular 21](https://angular.dev). It maps standalone Angular components to
the core scene part APIs.

This package is a thin re-export of `@atomic-testing/angular-core` that pins
the Angular 21 peer range — the implementation (interactor, settling, and
`createTestEngine`) is shared across all supported Angular majors. Using a
different Angular major? Install the matching `@atomic-testing/angular-*`
package instead.

## Install

```bash
npm install --save-dev @atomic-testing/angular-21 @atomic-testing/component-driver-html
```

`zone.js` is an optional peer: zoneless applications do not need it, and
`createTestEngine` bootstraps zoneless automatically when it is not loaded.

## Usage

```ts
import { createTestEngine } from '@atomic-testing/angular-21';
import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart, TestEngine } from '@atomic-testing/core';

const parts = {
  increment: { locator: byDataTestId('increment'), driver: HTMLButtonDriver },
  count: { locator: byDataTestId('count'), driver: HTMLElementDriver },
} satisfies ScenePart;

let engine: TestEngine<typeof parts>;

beforeEach(async () => {
  // Angular bootstrapping is asynchronous — await the engine.
  engine = await createTestEngine(CounterComponent, parts);
});

afterEach(() => engine.cleanUp());

it('increments', async () => {
  await engine.parts.increment.click();
  expect(await engine.parts.count.getText()).toBe('1');
});
```

Interactions settle through `ApplicationRef.whenStable()`, so the same test
passes whether the application under test runs zone-based or zoneless change
detection.

## Public API & stability

The stable surface of this package is its `.` barrel exports, frozen under
SemVer and machine-checked by the committed [API Extractor](https://api-extractor.com/)
report at [`etc/angular-21.api.md`](https://github.com/atomic-testing/atomic-testing/blob/main/packages/angular-21/etc/angular-21.api.md). Exports tagged `@internal` are
not part of that guarantee. See the [1.0 API freeze & evolution policy](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/006-1.0-api-freeze-and-evolution.md).
