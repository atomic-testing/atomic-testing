# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Atomic Testing** - a portable UI testing library that provides consistent APIs for testing UI components across different frameworks and environments (React, Playwright, DOM, Vue). The library uses a "component driver" pattern where high-level semantic APIs abstract away low-level DOM interactions.

## Essential Commands

### Development

- `pnpm install` - Install dependencies (requires Node.js >=22.12, pnpm >=10)
- `pnpm run check:lint` - Run ESLint with auto-fix
- `pnpm run check:style` - Format code with Prettier
- `pnpm run check:type` - Type check all packages
- `pnpm run check:types` - Alternative type check command

### Package-specific commands (run in package directories)

- `pnpm test` - Run Jest tests for DOM testing
- `pnpm run test:e2e` - Run Playwright end-to-end tests
- `pnpm run build` - Build package using tsdown

### Documentation

- `pnpm run typedoc` - Generate API documentation

## Architecture

### Component Driver Pattern

The core architectural pattern where UI components are wrapped with "driver" classes that provide semantic, high-level APIs:

```typescript
// Component drivers provide semantic methods instead of low-level DOM operations
emailDriver.setValue('user@example.com'); // vs document.querySelector(...).value = "..."
buttonDriver.click(); // vs complex event simulation
```

### Key Layers

1. **TestEngine** - Root orchestrator extending ComponentDriver
2. **ComponentDriver** - High-level semantic API, delegates to Interactor
3. **Interactor** - Environment-specific implementation (React/Playwright/DOM)
4. **PartLocator** - Flexible element selection using CSS selectors and chains

### Test Adapters

- **React** (`@atomic-testing/react-18`, `react-19`, `react-legacy`) - Uses React Testing Library
- **Playwright** (`@atomic-testing/playwright`) - Browser automation
- **DOM** (`@atomic-testing/dom-core`) - Direct DOM manipulation with JSDOM

### Scene Parts Pattern

Declarative structure for defining component hierarchies:

```typescript
const parts = {
  emailInput: { locator: byDataTestId('email'), driver: TextFieldDriver },
  submitButton: { locator: byDataTestId('submit'), driver: ButtonDriver },
} satisfies ScenePart;
```

## Package Structure

- **`packages/core/`** - Core abstractions (ComponentDriver, TestEngine, Locators)
- **`packages/react-*/`** - React test adapters for different versions
- **`packages/playwright/`** - Playwright integration
- **`packages/component-driver-*/`** - Specific component drivers (HTML, Material-UI variants)
- **`package-tests/*`** - Test suites for validating component drivers
- **`examples/`** - Example implementations

## Locator System

Uses composable CSS-based locators with builder functions:

- `byDataTestId('submit')` - Most common for test elements
- `byAttribute('aria-label', 'Close')` - Accessibility-focused selection
- `byCssSelector('.my-class')` - Direct CSS selection
- Locators can be chained: `append()`, positioned relatively, and linked dynamically

## Testing Approach

Each component driver package has corresponding test packages that validate behavior across both DOM and E2E environments:

- `*.dom.test.ts` - Fast DOM-based tests
- `*.e2e.test.ts` - Playwright browser tests

## Development Notes

- Monorepo managed with pnpm workspaces
- TypeScript with strict configuration
- ESLint + Prettier for code quality
- Uses `tsdown` for efficient TypeScript compilation
- Jest for unit testing, Playwright for E2E
- All component drivers must work identically across test environments
