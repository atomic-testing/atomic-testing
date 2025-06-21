# @atomic-testing/component-driver-mui-v5

Component drivers for [Material UI](https://mui.com) v5 components.
They map MUI widgets to the Atomic Testing scene part APIs so your tests can interact with them consistently.

## The problem

Material UI hides complex markup behind its components. Without dedicated drivers your tests often need to rely on implementation details, making them brittle as your application grows.

## The solution

The drivers in this package expose high‑level interactions for MUI widgets. Combined with the React adapter they let you reuse scene definitions across DOM and end‑to‑end tests, focusing on **reusability**, **composability** and **adaptability**.

## Installation

```bash
pnpm add @atomic-testing/core @atomic-testing/react-19 \
  @atomic-testing/component-driver-html @atomic-testing/component-driver-mui-v5 --save-dev
```

Refer to the [MUI driver guide](https://atomic-testing.dev/) for examples.

## Example

1. Create a small component using MUI and assign `data-testid` values to the elements you want to interact with:

   ```tsx title="Counter.tsx"
   import { useState } from 'react';

   import Button from '@mui/material/Button';

   export function Counter() {
     const [count, setCount] = useState(0);
     return (
       <div>
         <span data-testid='count'>{count}</span>
         <Button data-testid='increment' onClick={() => setCount(c => c + 1)}>
           Increment
         </Button>
       </div>
     );
   }
   ```

2. Define a `ScenePart` describing the count display and button using the MUI driver:

   ```ts title="counterScenePart.ts"
   import { HTMLSpanDriver } from '@atomic-testing/component-driver-html';
   import { ButtonDriver } from '@atomic-testing/component-driver-mui-v5';
   import { byDataTestId, ScenePart } from '@atomic-testing/core';

   export const counterScenePart = {
     count: { locator: byDataTestId('count'), driver: HTMLSpanDriver },
     increment: { locator: byDataTestId('increment'), driver: ButtonDriver },
   } satisfies ScenePart;
   ```

3. Write a test using `createTestEngine` to render the component and interact with it:

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

For more in‑depth information, visit [https://atomic-testing.dev](https://atomic-testing.dev).
