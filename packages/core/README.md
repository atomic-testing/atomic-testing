# @atomic-testing/core

[![NPM version](https://img.shields.io/npm/v/@atomic-testing/core.svg?style=flat)](https://www.npmjs.com/package/@atomic-testing/core)
![NPM license](https://img.shields.io/npm/l/@atomic-testing/core.svg?style=flat)

Core utilities that power the entire Atomic Testing ecosystem. The package
defines the primitives used to model scenes, locate elements and interact with
components across different test environments.

Atomic Testing is designed to offer a consistent way to interact with
third-party or first-party components across DOM and end-to-end tests. The core
focuses on **reusability**, **composability**, and **adaptability** so the same
tests can run in React, Vue, Playwright, Cypress and more.


## Key Features

- **Component Drivers** – programmatically interact with UI components. Drivers
  expose high level actions like clicking a button or reading a value.
- **Locators** – find elements using helpers such as `byDataTestId` or
  `byRole`.
- **Scene Parts** – describe the pieces of a page or widget as a map of drivers.
- **Test Engine** – renders a scene and provides access to all defined parts so
  tests can remain agnostic to the underlying framework.

## Example

```tsx
import { TextFieldDriver, ButtonDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/react-19';

import { Login } from './Login';

const loginScenePart = {
  username: { locator: byDataTestId('username'), driver: TextFieldDriver },
  password: { locator: byDataTestId('password'), driver: TextFieldDriver },
  submit: { locator: byDataTestId('submit'), driver: ButtonDriver },
} satisfies ScenePart;

const engine = createTestEngine(<Login />, loginScenePart);
await engine.parts.username.setValue('alice');
await engine.parts.password.setValue('secret');
await engine.parts.submit.click();
await engine.cleanUp();
```

Refer to the [documentation](https://atomic-testing.dev/) for detailed guides
and more examples. A complete signup form example can be found under
`examples/example-mui-signup-form`.
