# Atomic testing example - User signup form with React and MUI

This is an example multi-step application showing how to use [atomic-testing](https://www.atomic-testing.dev/) library
to develop composable, reusable and test platform agnostic tests.

## Key commands

| Command                | Description                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`             | Run the application locally at <http://localhost:5371>                                                                               |
| `pnpm test:dom`        | Run unit tests which tests form component behaviors, the unit tests are located in `__tests__` under /src/components/<componentName> |
| `pnpm test:e2e:chrome` | Run end-to-end tests, ProTip, try `pnpm test:e2e:chrome --ui` to run end-to-end tests in UI mode                                     |
| `pnpm storybook`       | Launch Storybook to see application components, some components such as Shipping Address form comes with Storybook interaction tests |
