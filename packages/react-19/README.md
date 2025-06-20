# @atomic-testing/react-19

Adapter for integrating Atomic Testing with [React&nbsp;19](https://react.dev).
It maps React components to the core scene part APIs.

## The problem

Writing maintainable tests for UIs built with third–party component libraries
like Material&nbsp;UI or Bootstrap can be tricky. Documentation on how a test
should communicate with these components is often lacking, so tests easily end
up coupled to implementation details. As your application grows you need your
tests to scale without constantly reworking them.

## The solution

Atomic Testing provides a consistent way to interact with both third–party and
first–party components across different test environments. It focuses on
**reusability**, **composability** and **adaptability**, letting you build
higher–level test strategies that work for DOM or end–to–end testing alike.

## Installation

```bash
pnpm add @atomic-testing/react-19
```

Refer to the [React integration guide](https://atomic-testing.dev/) for examples.

## Example

If you use MUI/Material&nbsp;UI components, have a look at the
[component-driver-mui-x-v8](https://www.npmjs.com/package/@atomic-testing/component-driver-mui-x-v8)
package for a dedicated example.

1. Install the core library and basic HTML drivers along with this React adapter:

   ```bash
   pnpm add @atomic-testing/core @atomic-testing/react-19 @atomic-testing/component-driver-html
   ```

2. Create a small component and assign `data-testid` values to the elements you want to interact with:

   ```tsx title="Counter.tsx"
   import { useState } from 'react';

   export function Counter() {
     const [count, setCount] = useState(0);
     return (
       <div>
         <span data-testid='count'>{count}</span>
         <button data-testid='increment' onClick={() => setCount(c => c + 1)}>
           Increment
         </button>
       </div>
     );
   }
   ```

3. Define a `ScenePart` describing the count display and button using the HTML drivers:

   ```ts title="counterScenePart.ts"
   import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
   import { byDataTestId, ScenePart } from '@atomic-testing/core';

   export const counterScenePart = {
     count: { locator: byDataTestId('count'), driver: HTMLElementDriver },
     increment: { locator: byDataTestId('increment'), driver: HTMLButtonDriver },
   } satisfies ScenePart;
   ```

4. Write a test using `createTestEngine` to render the component and interact with it:

   ```ts title="Counter.test.tsx"
   import { createTestEngine } from '@atomic-testing/react-19';

   import { Counter } from './Counter';
   import { counterScenePart } from './counterScenePart';

  test('increments when the button is clicked', async () => {
    const engine = createTestEngine(<Counter />, counterScenePart);

    expect(await engine.parts.count.getText()).toBe('0');
    await engine.parts.increment.click();
    expect(await engine.parts.count.getText()).toBe('1');

    await engine.cleanUp();
  });
  ```

For more in‑depth information, visit
[https://atomic-testing.dev](https://atomic-testing.dev).
