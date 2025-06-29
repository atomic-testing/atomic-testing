# @atomic-testing/vue-3

**Vue 3 test adapter** that extends Atomic Testing's component driver pattern to Vue applications. It enables testing Vue components using the same high-level semantic APIs used across React, Playwright, and DOM environments.

## Overview

The `@atomic-testing/vue-3` package brings Atomic Testing's "component driver" abstraction to Vue 3, maintaining architectural consistency while respecting Vue's unique reactivity model. It provides reliable, framework-agnostic testing by automatically handling Vue's async reactivity system.

### Key Features

✅ **Unified API**: Vue components use identical component drivers as other frameworks  
✅ **Reactivity Safety**: Properly handles Vue's async reactivity system using `nextTick()`  
✅ **Cross-Framework**: Test patterns learned in React translate directly to Vue  
✅ **E2E Ready**: Same drivers work in both DOM and Playwright environments  
✅ **Flexible Components**: Supports both compiled Vue components and template-based definitions

## Installation

```bash
pnpm add @atomic-testing/vue-3
```

## Architecture

### VueInteractor
Extends the base DOMInteractor with Vue-specific reactivity handling:
- Automatically calls `nextTick()` after each interaction
- Ensures Vue's reactive updates complete before proceeding
- Provides reliable, predictable testing experience

### Test Engine Factory
Two main functions for different testing scenarios:
- **`createTestEngine()`**: Renders and tests Vue components 
- **`createRenderedTestEngine()`**: Tests already-rendered components (e.g., Storybook)

### Framework Integration
- Uses `@testing-library/vue` for component rendering with fallback strategies
- Maintains the same ComponentDriver API as React adapters
- Enables cross-framework driver reuse

## Usage

### Basic Example

```typescript
import { createTestEngine } from '@atomic-testing/vue-3';
import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId } from '@atomic-testing/core';
import CounterComponent from './Counter.vue';

const engine = createTestEngine(CounterComponent, {
  incrementButton: { 
    locator: byDataTestId('increment'), 
    driver: HTMLButtonDriver 
  }
});

// Test interaction - automatically handles Vue reactivity
await engine.parts.incrementButton.click();
expect(await engine.parts.incrementButton.getText()).toBe('Count: 1');
```

### SFC-Like Components

For simplified testing, you can define components using template strings:

```typescript
import { createTestEngine } from '@atomic-testing/vue-3';

const TestComponent = {
  template: `
    <div>
      <button @click="increment" data-testid="counter">
        Count: {{ count }}
      </button>
    </div>
  `,
  setup() {
    const count = ref(0);
    const increment = () => count.value++;
    return { count, increment };
  }
};

const engine = createTestEngine(TestComponent, {
  button: { locator: byDataTestId('counter'), driver: HTMLButtonDriver }
});
```

### Testing Rendered Components

For components already rendered in the DOM (e.g., Storybook):

```typescript
import { createRenderedTestEngine } from '@atomic-testing/vue-3';

const engine = createRenderedTestEngine({
  button: { locator: byDataTestId('counter'), driver: HTMLButtonDriver }
});

// Test the already-rendered component
await engine.parts.button.click();
```

## Cross-Framework Compatibility

The same component drivers work across all Atomic Testing adapters:

```typescript
// Works identically in React, Vue, and Playwright
const parts = {
  emailInput: { locator: byDataTestId('email'), driver: TextFieldDriver },
  submitButton: { locator: byDataTestId('submit'), driver: ButtonDriver }
};

// React
const reactEngine = createTestEngine(<LoginForm />, parts);

// Vue 3
const vueEngine = createTestEngine(LoginFormVue, parts);

// Playwright
const playwrightEngine = createTestEngine(page, parts);
```

## Integration with Vue Ecosystem

### Vue Testing Library
The adapter uses `@testing-library/vue` internally with intelligent fallback strategies for component rendering.

### Vue Reactivity
All interactions automatically wait for Vue's reactivity cycle to complete:

```typescript
// This automatically calls nextTick() after the click
await engine.parts.button.click();

// Reactive state is guaranteed to be updated here
const updatedText = await engine.parts.button.getText();
```

### TypeScript Support
Full TypeScript support with proper Vue component typing:

```typescript
import type { Component } from 'vue';

const engine = createTestEngine<Component>(MyVueComponent, sceneParts);
```

## Why Use @atomic-testing/vue-3?

1. **Consistent Testing Patterns**: Learn once, test everywhere - same patterns work across React, Vue, and E2E
2. **Reliable Vue Integration**: Proper handling of Vue's reactivity ensures tests aren't flaky
3. **High-Level APIs**: Focus on user interactions, not DOM implementation details
4. **Framework Agnostic Drivers**: Reuse component drivers across different frameworks and test environments
5. **Future-Proof**: As your app grows or changes frameworks, your test patterns remain consistent
