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
- **`cd docs && pnpm build`** - Build Docusaurus documentation (IMPORTANT: Always test this before documentation PRs)

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
- **Vue 3** (`@atomic-testing/vue-3`) - Vue 3 integration with reactivity handling
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

### Core Packages

- **`packages/core/`** - Core abstractions (ComponentDriver, TestEngine, Locators)
- **`packages/dom-core/`** - Base DOM testing capabilities

### Framework Adapters

- **`packages/react-core/`** - Shared React adapter logic
- **`packages/react-18/`** - React 18 test adapter
- **`packages/react-19/`** - React 19 test adapter
- **`packages/react-legacy/`** - React 16/17 test adapter
- **`packages/vue-3/`** - Vue 3 test adapter with reactivity handling
- **`packages/playwright/`** - Playwright browser automation integration

### Component Drivers

- **`packages/component-driver-html/`** - Drivers for native HTML elements
- **`packages/component-driver-mui-v5/`** - Material-UI v5 component drivers
- **`packages/component-driver-mui-v6/`** - Material-UI v6 component drivers
- **`packages/component-driver-mui-v7/`** - Material-UI v7 component drivers
- **`packages/component-driver-mui-x-v5/`** - MUI X (Data Grid, Date Pickers) v5 drivers
- **`packages/component-driver-mui-x-v6/`** - MUI X v6 drivers
- **`packages/component-driver-mui-x-v7/`** - MUI X v7 drivers
- **`packages/component-driver-mui-x-v8/`** - MUI X v8 drivers

### Internal Packages

- **`packages/internal-react-example/`** - React example components for testing
- **`packages/internal-test-runner/`** - Shared test runner utilities
- **`packages/internal-test-runner-jest-adapter/`** - Jest adapter for test runner
- **`packages/internal-test-runner-vitest-adapter/`** - Vitest adapter for test runner
- **`packages/internal-mui-x-test-fixture/`** - MUI X test fixtures

### Test Suites

- **`package-tests/component-driver-html-test/`** - HTML driver validation
- **`package-tests/component-driver-mui-v5-test/`** - MUI v5 driver validation
- **`package-tests/component-driver-mui-v6-test/`** - MUI v6 driver validation
- **`package-tests/component-driver-mui-v7-test/`** - MUI v7 driver validation
- **`package-tests/component-driver-mui-x-v5-test/`** - MUI X v5 driver validation
- **`package-tests/component-driver-mui-x-v6-test/`** - MUI X v6 driver validation
- **`package-tests/component-driver-mui-x-v7-test/`** - MUI X v7 driver validation
- **`package-tests/component-driver-mui-x-v8-test/`** - MUI X v8 driver validation
- **`package-tests/vue-3-test/`** - Vue 3 adapter validation

### Other

- **`examples/`** - Example implementations and demos

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

## CI/CD & GitHub Actions

### Optimized Workflow Architecture

The repository uses an optimized "build-once-test-many" CI/CD pattern:

- **Auto-formatting**: Automatically formats code and commits changes if needed
- **Single build job**: Builds all packages once and caches results
- **Parallel testing**: Matrix strategy runs component driver tests in parallel
- **Artifact sharing**: Built packages shared between jobs via GitHub Actions artifacts
- **Smart conditionals**: Jobs skip when formatting changes trigger pipeline restart

### Key Workflow Files

- `.github/workflows/buildui.yml` - Main PR verification workflow
- `.github/workflows/publish.yml` - Package publishing on release
- `.github/workflows/doc-*.yml` - Documentation building and deployment
- `.github/actions/builderui-setup/` - Full setup with build
- `.github/actions/deps-setup/` - Dependencies-only setup

### Performance Impact

- **Before optimization**: 11 separate jobs each running full setup (~30-50min)
- **After optimization**: 1 build + parallel tests (~10-15min, 60-70% reduction)

## Framework-Specific Patterns

### Vue 3 Integration

The Vue adapter provides unique features:

- **Reactivity handling**: Automatically calls `nextTick()` after interactions
- **SFC-like components**: Supports template-based component definitions for testing
- **Dual rendering**: Uses `@testing-library/vue` with fallback strategies
- **Component transformation**: Converts SFC-like objects to proper Vue components

### React Integration

React adapters handle framework specifics:

- **React.act() wrapping**: All interactions wrapped in React's act()
- **Multiple versions**: Separate packages for React 18, 19, and legacy
- **React Testing Library**: Deep integration with established testing patterns

### Cross-Framework Compatibility

- Same component drivers work across React, Vue, Playwright, and DOM
- Consistent APIs enable learning once, testing everywhere
- Test patterns are transferable between frameworks

## Testing Strategy & Validation

### Multi-Environment Testing

Each component driver is validated across multiple environments:

- **`*.dom.test.ts`** - Fast JSDOM-based tests
- **`*.e2e.test.ts`** - Playwright browser tests
- Tests must pass identically in both environments

### Package Test Structure

- **`package-tests/component-driver-*-test/`** - Validation suites for component drivers
- **`package-tests/vue-3-test/`** - Vue-specific testing scenarios
- **`examples/`** - Real-world usage examples that also serve as integration tests

### Test Naming Convention

- Component drivers: `ComponentNameDriver` (e.g., `HTMLButtonDriver`)
- Test files: `*.dom.test.ts` for DOM, `*.e2e.test.ts` for browser
- Scene parts: Use `satisfies ScenePart` for type safety

## Code Navigation & Understanding

### Finding Component Implementations

- **Driver classes**: Look in `packages/component-driver-*/src/`
- **Framework adapters**: Look in `packages/{react-core,react-18,react-19,react-legacy,vue-3,playwright}/src/`
- **Core abstractions**: Look in `packages/core/src/`
- **Test examples**: Look in `package-tests/*/src/examples/`

### Understanding Component Drivers

1. **Start with the driver class** - High-level semantic API
2. **Check the interactor** - Framework-specific implementation
3. **Review test files** - See expected behavior patterns
4. **Look at examples** - Real usage in `package-tests/*/src/examples/`

### Architecture Deep Dive

```typescript
// Flow: User Test → ComponentDriver → Interactor → DOM
testEngine.parts.button.click()  // User call
  ↓ HTMLButtonDriver.click()     // Semantic API
  ↓ ReactInteractor.click()      // Framework handling
  ↓ DOMInteractor.click()        // DOM manipulation
```

## Development Notes & Best Practices

### Repository Management

- Monorepo managed with pnpm workspaces
- TypeScript with strict configuration
- ESLint + Prettier for code quality (auto-formatted in CI)
- Uses `tsdown` for efficient TypeScript compilation
- Jest for unit testing, Playwright for E2E

### Code Quality Standards

- **Auto-formatting**: CI automatically formats and commits code changes
- **Type safety**: Strict TypeScript with `satisfies` patterns
- **Cross-environment parity**: All drivers must work identically across test environments
- **Semantic versioning**: Packages follow semver for releases

### Common Patterns

- **Scene Parts**: Use `satisfies ScenePart` for declarative component structure
- **Locators**: Prefer `byDataTestId()` for test-specific elements
- **Driver naming**: `{Framework}{Component}Driver` pattern
- **Test structure**: Group by component, split by environment (DOM/E2E)

### Performance Considerations

- **Build optimization**: `tsdown` for fast TypeScript compilation
- **Test parallelization**: Matrix strategies for component driver tests
- **Caching**: GitHub Actions cache for dependencies and build artifacts
- **Smart dependencies**: Conditional job execution to avoid waste

## Troubleshooting & Common Issues

### Vue Reactivity

- Vue tests failing? Check if `nextTick()` handling is working
- SFC-like components not rendering? Verify template syntax and setup function

### Component Driver Issues

- Driver not found? Check import paths and package dependencies
- Inconsistent behavior? Verify driver works in both DOM and E2E tests
- Locator not working? Test with `byDataTestId()` first, then customize

### CI/CD Issues

- Build failures? Check if auto-formatting committed changes and retriggered
- Test timeouts? Look for missing `await` keywords in async operations
- Matrix job failures? Verify directory names match in `package-tests/`

### Documentation Issues

- **Always test docs build**: `cd docs && pnpm build` before submitting documentation PRs
- **File ID mismatches**: Check frontmatter `id` field matches sidebar references (not filename)
- **Broken links**: Use relative paths like `./tutorial` for internal docs links
- **Docusaurus structure**: `docs/docs/` contains content, `docs/sidebars.ts` defines navigation
- **API docs**: Auto-generated in `docs/docs/api/` - warnings about missing TypeDoc references are usually non-critical

## Documentation Architecture

### Docusaurus Setup

- **Content**: `docs/docs/*.mdx` files with frontmatter
- **Navigation**: `docs/sidebars.ts` defines sidebar structure
- **Homepage**: `docs/src/pages/index.tsx` and `docs/src/components/HomepageFeatures/`
- **Config**: `docs/docusaurus.config.ts` for site settings

### Documentation User Journey

1. **Homepage** → Value proposition, click "Get Started"
2. **Quick Start** → Framework selection, 5-minute working example
3. **Framework Guide** → Package selection based on tech stack
4. **Why Atomic Testing** → Long-term ROI demonstration
5. **Tutorial/Setup** → Complete implementation guides

### Content Strategy

- **Progressive disclosure**: Start simple, add complexity gradually
- **Framework-agnostic examples**: Show cross-framework compatibility upfront
- **Real-world scenarios**: Migration stories, upgrade scenarios, ROI demonstrations
- **Practical first**: Working code before concepts
- **Decision trees**: Help users choose the right packages/approach
