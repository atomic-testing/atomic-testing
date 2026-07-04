# @atomic-testing/component-driver-angular-material-v21

Component drivers for [Angular Material](https://material.angular.dev) v20 components. Component drivers expose simple APIs for unit tests or end‑to‑end tests to interact with Angular Material components—such as reading states and setting values—so test engineers can focus on test flows without needing to track how the inner Material components work.

## The problem

Angular Material hides complex markup behind its components. Without dedicated drivers your tests often need to rely on implementation details—such as the `.mat-mdc-*` classes Angular documents as unstable—making them brittle as your application grows.

## The solution

The drivers in this package expose high‑level interactions for Angular Material widgets, anchored on the components' DOM/ARIA contract rather than their styling internals. Combined with the Angular adapter, they let you reuse scene definitions across DOM and end‑to‑end tests, focusing on **reusability**, **composability** and **adaptability**.

Using a different Angular Material major? Install the matching
`@atomic-testing/component-driver-angular-material-*` package instead.

## Installation

```bash
npm install @atomic-testing/core @atomic-testing/angular-21 \
  @atomic-testing/component-driver-html @atomic-testing/component-driver-angular-material-v21 --save-dev
```

Refer to the [documentation](https://atomic-testing.dev/) for usage patterns and examples.

## Example

1. Create a small standalone component using Angular Material and assign `data-testid` values to the elements you want to interact with:

   ```ts title="counter.component.ts"
   import { Component, signal } from '@angular/core';
   import { MatButton } from '@angular/material/button';

   @Component({
     selector: 'app-counter',
     imports: [MatButton],
     template: `
       <span data-testid="count">{{ count() }}</span>
       <button matButton data-testid="increment" (click)="increment()">Increment</button>
     `,
   })
   export class CounterComponent {
     readonly count = signal(0);

     increment(): void {
       this.count.update(value => value + 1);
     }
   }
   ```

2. Define a `ScenePart` describing the count display and button using the Material driver:

   ```ts title="counterScenePart.ts"
   import { ButtonDriver } from '@atomic-testing/component-driver-angular-material-v21';
   import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
   import { byDataTestId, ScenePart } from '@atomic-testing/core';

   export const counterScenePart = {
     count: { locator: byDataTestId('count'), driver: HTMLElementDriver },
     increment: { locator: byDataTestId('increment'), driver: ButtonDriver },
   } satisfies ScenePart;
   ```

3. Write a test using `createTestEngine` to bootstrap the component and interact with it:

   ```ts title="counter.component.test.ts"
   import { createTestEngine } from '@atomic-testing/angular-21';

   import { CounterComponent } from './counter.component';
   import { counterScenePart } from './counterScenePart';

   test('increments when the button is clicked', async () => {
     // Angular bootstrapping is asynchronous — await the engine.
     const engine = await createTestEngine(CounterComponent, counterScenePart);

     expect(await engine.parts.count.getText()).toBe('0');
     await engine.parts.increment.click();
     expect(await engine.parts.count.getText()).toBe('1');

     await engine.cleanUp();
   });
   ```

For more in‑depth information, visit [https://atomic-testing.dev](https://atomic-testing.dev).
