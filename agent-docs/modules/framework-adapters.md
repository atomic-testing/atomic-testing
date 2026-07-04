# Module group: framework adapters (React, Vue & Angular)

Covers the packages that adapt the DOM interactor to a UI framework's render lifecycle and reactivity:

| Package                              | Provides                                                                  | Targets              |
| ------------------------------------ | ------------------------------------------------------------------------- | -------------------- |
| `@atomic-testing/react-core`         | `ReactInteractor`, `createTestEngine`, `createRenderedTestEngine`         | shared React logic   |
| `@atomic-testing/react-18`           | re-exports `createTestEngine`, `createRenderedTestEngine` from react-core | React 18             |
| `@atomic-testing/react-19`           | same                                                                      | React 19             |
| `@atomic-testing/react-legacy`       | same                                                                      | React ≤17            |
| `@atomic-testing/vue-3`              | `VueInteractor`, `createTestEngine`, `createRenderedTestEngine`           | Vue 3                |
| `@atomic-testing/angular-core`       | `AngularInteractor`, `createTestEngine`, `createRenderedTestEngine`       | shared Angular logic |
| `@atomic-testing/angular-20/-21/-22` | re-export of `angular-core`                                               | Angular 20 / 21 / 22 |

> Why so many React packages? They isolate React-major render-API differences from consumers. `react-18` and `react-19` are thin re-exports of `react-core`'s implementation (#1014); they exist only to pin different peer ranges. See [ADR-003](../adr/003-version-specific-packages.md). The Angular packages take the same refined shape from day one — implementation once in `angular-core`, per-major packages as pure re-exports pinning `@angular/*` peer ranges — see [ADR-013](../adr/013-angular-shared-core-thin-packages.md).

## Purpose

Render a component into the DOM (or wrap a pre-rendered one) and inject an interactor that flushes the framework's pending updates after each action, so the same driver code behaves deterministically.

## Public surface

| Export                                                                                | Package                                               | File                                                                         |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| `ReactInteractor` (extends `DOMInteractor`)                                           | react-core                                            | [ReactInteractor.ts](../../packages/react-core/src/ReactInteractor.ts#L22)   |
| `createTestEngine`, `createRenderedTestEngine`                                        | react-core (re-exported by react-18/19)               | [createTestEngine.ts](../../packages/react-core/src/createTestEngine.ts)     |
| `createTestEngine`, `createRenderedTestEngine`                                        | react-legacy                                          | [createTestEngine.ts](../../packages/react-legacy/src/createTestEngine.ts)   |
| `IReactTestEngineOption` (`{ rootElement? }`)                                         | react-core (re-exported by react-18/19), react-legacy | [react-core/types.ts](../../packages/react-core/src/types.ts#L3)             |
| `VueInteractor` (extends `DOMInteractor`)                                             | vue-3                                                 | [VueInteractor.ts](../../packages/vue-3/src/VueInteractor.ts#L22)            |
| `createTestEngine`, `createRenderedTestEngine`                                        | vue-3                                                 | [createTestEngine.ts](../../packages/vue-3/src/createTestEngine.ts)          |
| `IVueTestEngineOption`, `VueSFCLikeComponent`                                         | vue-3                                                 | [vue-3/types.ts](../../packages/vue-3/src/types.ts)                          |
| `AngularInteractor` (extends `DOMInteractor`)                                         | angular-core                                          | [AngularInteractor.ts](../../packages/angular-core/src/AngularInteractor.ts) |
| `createTestEngine` (async), `createRenderedTestEngine`                                | angular-core (re-exported by angular-20/-21/-22)      | [createTestEngine.ts](../../packages/angular-core/src/createTestEngine.ts)   |
| `AngularAppStability`, `IAngularTestEngineOption`, `IAngularRenderedTestEngineOption` | angular-core                                          | [angular-core/types.ts](../../packages/angular-core/src/types.ts)            |

## How it works

### ReactInteractor

Extends `DOMInteractor` and `override`s every interactive method to wrap the `super` call in `act()` from `@testing-library/react`, so React state updates are flushed before the method resolves ([ReactInteractor.ts](../../packages/react-core/src/ReactInteractor.ts)):

```ts
override async click(locator, option?) {
  await act(async () => { await super.click(locator, option); });
}
```

The `user-event`-backed methods (`click`, `hover`, `activate`, `enterText`, `selectOptionValue`, `setInputFiles`) additionally pin the `IS_REACT_ACT_ENVIRONMENT` global to `true` for the duration of the call (`runUserEvent` — see its doc comment): `@testing-library/react`'s `asyncWrapper` temporarily disables the act environment around async `user-event` calls, which is only correct when `user-event` is _not_ already act-managed; nested inside this interactor's `act()` it would otherwise make react-dom log `The current testing environment is not configured to support act(...)` for every update — enough log volume on update-heavy trees (Radix) to kill CI jest runs.

`clone()` returns `new ReactInteractor(this.rootEl)`.

### VueInteractor

Extends `DOMInteractor` and `override`s each method to call `super.*` then `await this.flush()`, where `flush` awaits Vue's `nextTick()` ([VueInteractor.ts#L22-L114](../../packages/vue-3/src/VueInteractor.ts#L22-L114)). The flush happens **after** the action (vs React wrapping the action).

### AngularInteractor

Extends `DOMInteractor` in the Vue shape — `super.*` then settle — where settling awaits the bootstrapped app's `ApplicationRef.whenStable()`, bounded by a `settleTimeoutMs` (apps that never stabilize must not deadlock interactions). `whenStable()` is idle-detection for **both** zone.js and zoneless change detection, so there is no zone feature detection at interaction time. Stability is per-app state, not a global like React's `act()`, so the `ApplicationRef` is injected at construction as the minimal structural `AngularAppStability` (`{ whenStable(): Promise<void> }`) — the interactor has no `@angular/core` import ([AngularInteractor.ts](../../packages/angular-core/src/AngularInteractor.ts), [settling.ts](../../packages/angular-core/src/settling.ts)).

### createTestEngine variants

All five follow the same shape: append a container to `rootElement ?? document.body`, tag it with a `data-*` attribute, render, build `TestEngine(byAttribute(attr, id), interactor, { parts }, cleanup)`. They differ only in the render/unmount API:

|              | react-18 / react-19                                                                                                    | react-legacy                                                                                                           | vue-3                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| render       | `createRoot(container).render(node)` in `act()` ([L33-L36](../../packages/react-core/src/createTestEngine.ts#L33-L36)) | `ReactDOM.render(node, container)` in `act()` ([L35-L37](../../packages/react-legacy/src/createTestEngine.ts#L35-L37)) | `render(component, { container })` from `@testing-library/vue`, fallback `createApp().mount()` ([L68-L80](../../packages/vue-3/src/createTestEngine.ts#L68-L80)) |
| `act` import | `@testing-library/react`                                                                                               | `react-dom/test-utils`                                                                                                 | —                                                                                                                                                                |
| unmount      | `root.unmount()` in `act()`                                                                                            | `ReactDOM.unmountComponentAtNode`                                                                                      | `unmount()` / `app.unmount()`                                                                                                                                    |
| attribute    | `data-atomic-testing-react`                                                                                            | `data-atomic-testing-react-legacy`                                                                                     | `data-atomic-testing-vue`                                                                                                                                        |
| input        | `ReactNode`                                                                                                            | `ReactElement`                                                                                                         | `Component \| VueSFCLikeComponent`                                                                                                                               |

`createRenderedTestEngine(rootElement, parts)` skips rendering — it tags an existing element and wires cleanup to just remove the attribute. Useful in Storybook-style environments where the host renders the component ([react-core/createTestEngine.ts#L65-L88](../../packages/react-core/src/createTestEngine.ts#L65-L88)).

The Angular `createTestEngine` differs in three deliberate ways ([angular-core/createTestEngine.ts](../../packages/angular-core/src/createTestEngine.ts)): it is **async** (Angular bootstrap is a promise); it mounts through `createApplication` + `appRef.bootstrap(component, hostNode)` — passing the host node directly, so the component's selector never needs to exist in the page; and it feature-detects zone.js once at bootstrap, adding `provideZonelessChangeDetection()` when `Zone` is absent (root marker `data-atomic-testing-angular`, unmount via `appRef.destroy()`).

`vue-3` additionally accepts a `VueSFCLikeComponent` (`{ template, setup?, data?, methods?, computed?, props?, name? }`) and compiles it via `defineComponent` before mounting ([createTestEngine.ts#L15-L48](../../packages/vue-3/src/createTestEngine.ts#L15-L48)).

## Non-goals

- These packages do not query/act on the DOM themselves beyond what `DOMInteractor` provides — they only add reactivity flushing and lifecycle.
- They do not provide assertions or test orchestration — see [modules/test-runner.md](test-runner.md).

## Invariants & failure modes

- Each `createTestEngine` call creates a fresh engine + container; `cleanUp()` unmounts and removes the container. Do not share an engine across tests — `useTestEngine` enforces per-test creation.
- React reactivity is only correctly flushed if interactions go through the driver/`ReactInteractor`; bypassing it (raw DOM events) skips `act()`.

## Dependencies

- react-core → `core`, `dom-core`, `@testing-library/react`, plus wide React peer deps (`react`/`react-dom` `>=18.0.0`).
- react-18/19/legacy → `core`, `dom-core`, `react-core`, plus React peer deps pinned to their major ([react-18/package.json#L36-L54](../../packages/react-18/package.json#L36-L54)).
- vue-3 → `core`, `dom-core`, `@testing-library/vue`, `@vue/compiler-sfc` ([vue-3/package.json#L36-L52](../../packages/vue-3/package.json#L36-L52)).
- angular-core → `core`, `dom-core`; `@angular/*` are peers only (`>=20 <23`, with `zone.js` and `@angular/compiler` optional). angular-20/-21/-22 → `angular-core` plus the per-major `@angular/*` peer pins ([angular-20/package.json](../../packages/angular-20/package.json)).

## Extension points

- **Support a new React major** → if the render/unmount API is unchanged, add a thin re-export package like `react-18`/`react-19` that only pins the new peer range; if the API changed, adjust `react-core` (or fork a new core). Reuse `ReactInteractor` unchanged if `act` semantics match.
- **Support another DOM framework** → mirror `vue-3`: subclass `DOMInteractor` with the framework's flush primitive, add a `createTestEngine`.
- **Support a new Angular major** → usually just a new thin package (copy `angular-22`, bump the peer range) and a widened `angular-core` peer range; only a behavioral break would push code out of `angular-core` ([ADR-013](../adr/013-angular-shared-core-thin-packages.md)).

## Related files

- [../ARCHITECTURE.md](../ARCHITECTURE.md#createtestengine-variants--what-actually-differs) — variant comparison.
- [modules/dom-core.md](dom-core.md) — the base interactor these extend.
- [adr/003-version-specific-packages.md](../adr/003-version-specific-packages.md) — rationale for the version split.
