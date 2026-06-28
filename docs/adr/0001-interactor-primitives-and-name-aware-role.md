# ADR 0001 — New Interactor primitives & name-aware role resolution

- **Status:** Proposed
- **Date:** 2026-06-28
- **Scope:** Astryx drivers Wave 0 (GitHub #910; umbrella #909)
- **Supersedes signatures in:** `01-spec.md` → "New-primitive shapes"; the per-step
  prompts for steps 4–7. Where this ADR and a later prompt disagree, **this ADR wins** —
  the deltas are called out under each decision.

This ADR ratifies two design decisions before any implementation step (4–7) runs:

- **Decision A** — five additive `Interactor` primitives: `setInputFiles`,
  `scrollIntoView` / `scrollBy`, `dragTo` / `drag`, `getBoundingRect`, `contextMenu`.
- **Decision B** — accessible-name-correct role resolution (`BYROLE_NAME(b)`), **design
  only**; implementation is deferred to a follow-up wave per #909.

Both decisions exist for one reason: Astryx is StyleX-styled (build-time-hashed class
names — not stable anchors) and ARIA-role-first. The stable anchors are **role +
accessible name + a few `data-*` attributes**. Wave 0 closes the `Interactor` gaps that
role/name-first testing needs.

---

## Layer model (shared by every primitive below)

The interactor hierarchy and the per-primitive layer rule from `02-architecture.md` §1–§2:

```
Interactor (interface)            packages/core/src/interactor/Interactor.ts
  └ DOMInteractor                 packages/dom-core/src/DOMInteractor.ts      (jsdom: @testing-library)
      ├ ReactInteractor           packages/react-core/src/ReactInteractor.ts  (wraps super in act())
      ├ VueInteractor             packages/vue-3/src/VueInteractor.ts         (awaits super then nextTick())
      └ PlaywrightInteractor      packages/playwright/src/PlaywrightInteractor.ts (browser)
```

- **Mutative primitive** (changes the page) → touch **5 layers**: interface +
  `DOMInteractor` + `ReactInteractor` (`act()` override) + `VueInteractor` (`nextTick()`
  override) + `PlaywrightInteractor`. Omitting the React/Vue override is a correctness bug,
  not a style choice: a mutation that is not flushed through `act()` / `nextTick()` races
  the framework's re-render and produces flaky reads.
- **Read-only primitive** (`getBoundingRect`) → touch **3 layers**: interface +
  `DOMInteractor` + `PlaywrightInteractor`. React/Vue **inherit unwrapped** — there is no
  state mutation to flush, so an override would be dead code (see the existing read-only
  accessors `getText`, `getAttribute`, `isDisabled`, which have no React/Vue override).

Every method below resolves its target through the existing CSS seam
(`locatorUtil.toCssSelector(locator, this)` → jsdom `querySelector` / Playwright
`page.locator()`), exactly like the current primitives. The locator model is **not**
changed by Decision A. (Decision B is the one that breaks it — see below.)

---

## Decision A — additive Interactor primitives

### Context

Downstream Astryx driver waves (1–4) need to drive file inputs, scroll lazy/overflow
regions into view, exercise drag-reorder and slider/resize widgets, read element geometry
for layout-dependent assertions, and open right-click context menus. None of these is
expressible through the current `Interactor` surface. Each is a **new interface method**
(unlike MODIFIER_KEYS in step 1, which only extended an existing option type), so per #910
each is human-reviewed and ratified here before implementation.

### Decision (ratified signatures)

All live on `Interactor` (`packages/core/src/interactor/Interactor.ts`). Mutative methods
go in the "Potentially DOM mutative interactions" region; `getBoundingRect` goes in the
"Read only interactions" region.

```ts
// FILE_UPLOAD — mutative
setInputFiles(locator: PartLocator, files: string | string[]): Promise<void>;

// SCROLL — mutative
scrollIntoView(locator: PartLocator): Promise<void>;
scrollBy(locator: PartLocator, delta: Point): Promise<void>;

// DRAG — mutative
dragTo(source: PartLocator, target: PartLocator): Promise<void>;
drag(locator: PartLocator, delta: Point): Promise<void>;

// GEOMETRY — read-only
getBoundingRect(locator: PartLocator): Promise<BoundingRect>;

// RIGHT-CLICK — mutative
contextMenu(locator: PartLocator): Promise<void>;
```

#### Shared shape types (where they live in `packages/core`)

- **Reuse the existing `Point`** (`packages/core/src/geometry/Point.ts`,
  `{ x: number; y: number }`, already exported via `core/src/geometry/index.ts` →
  `core/src/index.ts`). `scrollBy` and `drag` take `delta: Point`. This **changes the spec's
  inline `delta: { x: number; y: number }`** to the named `Point` type — same structural
  shape, but DRY and consistent with the existing `Point` already used by `MouseOption`
  positions and `DOMInteractor.calculateMousePosition`.
- **Add `BoundingRect`** as a new geometry type, one concept per file, mirroring `Point`:
  - File: `packages/core/src/geometry/BoundingRect.ts`
    ```ts
    export interface BoundingRect {
      x: number;
      y: number;
      width: number;
      height: number;
    }
    ```
  - Re-export from `packages/core/src/geometry/index.ts` (the only barrel allowed at that
    level — it already does `export * from './Point'`). No new top-level barrel.
  - Rationale for a named type over an inline object literal: the shape is shared across
    three layers (interface, jsdom, Playwright) and is part of the public API surface
    TypeDoc renders; a named interface keeps the docs and signatures stable.

#### Layers touched per primitive (per the layer model above)

> Count reconciliation: the **five** capability groups (FILE_UPLOAD, SCROLL, DRAG, GEOMETRY,
> RIGHT-CLICK) expand to **seven** `Interactor` methods, because SCROLL contributes
> `scrollIntoView` + `scrollBy` and DRAG contributes `dragTo` + `drag`. The table below has
> one row per method.

| Primitive         | Kind      | Layers | React/Vue override?          |
| ----------------- | --------- | ------ | ---------------------------- |
| `setInputFiles`   | mutative  | 5      | yes — `act()` / `nextTick()` |
| `scrollIntoView`  | mutative  | 5      | yes                          |
| `scrollBy`        | mutative  | 5      | yes                          |
| `dragTo`          | mutative  | 5      | yes                          |
| `drag`            | mutative  | 5      | yes                          |
| `getBoundingRect` | read-only | 3      | **no** — inherit unwrapped   |
| `contextMenu`     | mutative  | 5      | yes                          |

> Half-wiring fails type-check across dependents: adding a method to the `Interactor`
> interface without implementing it in **all four** concrete classes (`DOMInteractor`,
> `PlaywrightInteractor`, and — for mutative methods — the React/Vue overrides that must
> exist for the flush) breaks compilation in every package that imports them.

### Per-engine backing

| Primitive         | jsdom (`DOMInteractor`, `@testing-library`)                                                                                                                                                                                                           | Playwright (`PlaywrightInteractor`)                                                                                                                                                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setInputFiles`   | `userEvent.upload(el, file[])` — caller passes path string(s); the DOM layer reads each as a `File` (Node `fs` → `File`/`Blob`). Fully supported.                                                                                                     | `page.locator(css).setInputFiles(files)` — native, accepts path string(s).                                                                                                                                                                                                                |
| `scrollIntoView`  | **No-op** (jsdom has no layout/scroll). Resolve after asserting the element exists; document E2E-only.                                                                                                                                                | `page.locator(css).scrollIntoViewIfNeeded()`.                                                                                                                                                                                                                                             |
| `scrollBy`        | **No-op** for actual scrolling; optionally dispatch a `wheel`/`scroll` event for handler coverage but assert nothing about offset. E2E-only behavior.                                                                                                 | `locator.hover()` then `page.mouse.wheel(delta.x, delta.y)`.                                                                                                                                                                                                                              |
| `dragTo`          | Synthesize the pointer sequence (`mousedown` on source → `mousemove` → `mouseup` on target) via `fireEvent`, using each element's (zeroed) `getBoundingClientRect`. Event wiring is exercised; **positional outcome is not** — E2E-only for geometry. | `page.locator(srcCss).dragTo(page.locator(tgtCss))`.                                                                                                                                                                                                                                      |
| `drag`            | Synthesize `mousedown` → `mousemove(+delta)` → `mouseup` from the caller-supplied `delta` via `fireEvent` (deltas are caller-given, so no layout needed for the event payload). Behavioral outcome still E2E-only.                                    | Manual `mouse.move/down/move/up` from `boundingBox()` center + `delta` — **avoid the `mouse.move(0,0)` reset** that the existing `mouseMove` performs after hovering (verified: `mouseMove` calls `page.mouse.move(0,0)`; `mouseDown`/`mouseUp` do not), which would corrupt a drag path. |
| `getBoundingRect` | Return `el.getBoundingClientRect()` mapped to `BoundingRect`. jsdom returns **all zeros** (no layout) → structurally valid, behaviorally meaningless. E2E-only for real geometry.                                                                     | `page.locator(css).boundingBox()` mapped to `BoundingRect`; if `null` (detached/invisible) return zeros or throw `ElementNotFoundError` — **ratified: throw `ElementNotFoundError`** to match every other primitive's "element not found" contract.                                       |
| `contextMenu`     | `fireEvent.contextMenu(el)` (focus first, mirroring `pressKey`/`click`). Supported in jsdom.                                                                                                                                                          | `page.locator(css).click({ button: 'right' })`. (Fallback `dispatchEvent('contextmenu')` only if a target swallows the real right-click.)                                                                                                                                                 |

`ElementNotFoundError` is thrown by every mutative method when the locator matches nothing,
matching the existing `click`/`pressKey`/`enterText` contract.

### jsdom-limitation policy (how each is gated)

jsdom has no layout engine, so SCROLL / DRAG / GEOMETRY have **no observable behavior**
there. Policy (per `02-architecture.md` §4.5):

- **JSDoc** on each affected method records that the behavioral effect is **E2E-only**
  (the _why_: "jsdom has no layout; this no-ops / returns zeros under jsdom").
- **`.suite.ts` test gating** (the three-file pattern): behavioral assertions for
  `scrollIntoView`, `scrollBy`, `dragTo`, `drag`, and `getBoundingRect` geometry run
  **only in the Playwright adapter**. The jsdom adapter covers structure/attribute reads
  and "does not throw / element-not-found throws" contracts only — never offsets or
  coordinates. Concretely, the suite branches on the runner (e.g. a capability flag passed
  through the `TestFrameworkMapper`, or an E2E-only `describe` block the jsdom adapter
  skips), so the same suite file stays green in both runners.
- `setInputFiles` and `contextMenu` are **fully supported in both** engines → no gating;
  asserted in jsdom and all three browsers.

### Options considered

1. **Inline object types for delta/rect (as the spec drafted).** Rejected: duplicates the
   existing `Point` and would spread an unnamed `{x,y,width,height}` across three layers and
   the public TypeDoc surface. Named `Point` + `BoundingRect` is DRY and stable.
2. **Number-pair signatures (`scrollBy(locator, x, y)`).** Rejected: inconsistent with the
   option-object/`Point` convention already used for mouse positions; a single `delta: Point`
   reads better at call sites and matches `Playwright mouse.wheel`.
3. **A separate `Geometry`/`Scroll` sub-interface.** Rejected as speculative abstraction
   (`02-architecture.md` §3 "right-size"): five methods on the existing flat `Interactor`
   is the right size; a sub-interface adds indirection with no present payoff.
4. **Returning `null` from `getBoundingRect` when detached** (mirroring Playwright's
   `boundingBox()`). Rejected: every other primitive throws `ElementNotFoundError` on a
   missing element; returning `null` would force every caller to branch and diverge from the
   house contract. We throw.
5. **`drag` reusing the existing `mouseMove`/`mouseDown` building blocks in Playwright.**
   Rejected: `mouseMove` deliberately calls `page.mouse.move(0,0)` after hovering, which
   resets the pointer; composing a drag from these helpers would break a continuous path.
   (`mouseDown`/`mouseUp` hover-then-act and do not reset, but reusing them piecemeal still
   can't express one uninterrupted gesture.) `drag`/`dragTo` need their own uninterrupted
   `move/down/move/up` sequence.

### Consequences

- `Interactor` grows by 7 methods; `DOMInteractor` and `PlaywrightInteractor` each gain 7
  implementations; `ReactInteractor` and `VueInteractor` each gain 6 mutative overrides
  (all except `getBoundingRect`). `packages/core` gains `geometry/BoundingRect.ts` (+ one
  re-export line). No existing signature changes → **zero churn** to existing drivers/tests.
- `Point` becomes load-bearing for the public API of two new methods; it is already
  exported, so no new export wiring beyond `BoundingRect`.
- The CSS-only locator model is **preserved** — every method still resolves via
  `locatorUtil.toCssSelector`. Decision A does not touch the locator seam.
- jsdom suites stay meaningful but cannot prove scroll/drag/geometry behavior; the
  cross-browser Playwright gate (chromium + firefox + webkit) is the real proof for those.

### Test strategy

- **Fully cross-engine (jsdom + 3 browsers):** `setInputFiles`, `contextMenu`.
- **E2E-only behavior (jsdom = structure/throw contracts only):** `scrollIntoView`,
  `scrollBy`, `dragTo`, `drag`, `getBoundingRect`.
- Author tests in the three-file `.suite.ts` / `.dom.test.ts` / `.e2e.test.ts` pattern;
  E2E-only assertions are gated to the Playwright adapter as above.
- Per `02-architecture.md` §4: **build `dist/` first** (`pnpm run build:packages`) before
  any Jest run; run Playwright with `--reporter=list`.

### Migration / compatibility note

Purely additive. No call site changes, no test migration. The only spec delta is
`delta: { x: number; y: number }` → `delta: Point` and the introduction of the named
`BoundingRect` return type — both structurally identical to the spec's inline shapes, so
steps 4–7 implement the signatures above verbatim.

---

## Decision B — accessible-name-correct `findByRole` (`BYROLE_NAME(b)`)

> **Wave 0 ships this section as design only.** No interface method, no implementation.
> Implementation is a follow-up wave per #909. Step 2 (`BYROLE_NAME(a)`) already lands the
> _verbatim-`aria-label`_ stopgap; this ADR records why the _computed-name_ version cannot
> follow the same path and sketches the path it must take instead.

### Context

`byRole(value, { name })` from step 2 produces a CSS selector
`[role="X"][aria-label="<escaped>"]`. That only matches a name carried **verbatim in the
`aria-label` attribute**. The real ARIA accessible name is **computed** by the accname
algorithm: `aria-labelledby` (id-ref chains), an associated `<label>`, wrapping/`title`
text, and visible descendant text — none of which is expressible in a CSS selector.

### Why it breaks the CSS-only locator model

Every locator in the system funnels through `locatorUtil.toCssSelector(locator, interactor)`
and is resolved by a single CSS query (jsdom `querySelector` / Playwright `page.locator()`).
The accessible name is the output of a multi-node graph traversal (id refs, label
association, text collection) — there is **no CSS selector** that expresses "role X whose
_computed_ accessible name equals Y". So `BYROLE_NAME(b)` cannot be just another
`CssLocatorSource` variant; forcing it into the CSS seam is impossible, not merely awkward.

### Proposed resolution path (design)

Introduce a **name-aware resolution that bypasses the CSS seam**, backed by engines that
already implement the accname algorithm:

- **Playwright:** `page.getByRole(role, { name })` (accname-correct, supports `exact`).
- **jsdom (`dom-core`):** `@testing-library/dom`'s `getByRole(container, role, { name })`
  / `queryByRole` — already a `dom-core` dependency (`@testing-library/dom >=10.4.1`), and
  it implements the same accname algorithm (via `dom-accessibility-api`).

Both reduce a `(role, name)` pair to a concrete element **without** producing a CSS string.

**Interface touchpoint (sketch, not ratified):** add a dedicated resolution op on
`Interactor`, e.g.

```ts
// Follow-up wave — NOT implemented in Wave 0:
findByRole(role: string, options?: { name?: string; exact?: boolean }): Promise<PartLocator>;
// or a resolver that yields an opaque, engine-native handle the other primitives accept.
```

so the name → element resolution happens **inside each interactor** (where the accname
engine lives), and the result is fed to the existing primitives (`click`, `getText`, …).

**Coexistence with the CSS path.** The existing CSS locator path is untouched and remains
the default for role + verbatim `aria-label` (step 2's stopgap covers the common Astryx
case). The name-aware path is **additive and opt-in** — a second resolution channel for the
minority of widgets whose name is computed, not verbatim. A locator carrying a "needs
accname resolution" marker would route to `findByRole` instead of `toCssSelector`; locators
without it keep the zero-overhead CSS path. No existing locator or driver changes.

### Options considered

1. **Extend the CSS seam to express accessible name.** Rejected — impossible; the name is
   not CSS-expressible (the core finding above).
2. **Approximate accname with CSS** (`[role=X][aria-label=Y]`, i.e. step 2's stopgap).
   Accepted **as the stopgap only**; it does not resolve `aria-labelledby`/`<label>`/text,
   so it cannot be the final answer for computed names.
3. **Name-aware resolver bypassing CSS, backed by Playwright `getByRole` +
   `@testing-library/dom` `getByRole`.** **Selected (design).** Both engines already ship
   the accname algorithm, so we adopt a battle-tested implementation rather than re-deriving
   it. Implementation deferred per #909.
4. **Ship `BYROLE_NAME(b)` now, in Wave 0.** Rejected — explicitly out of scope; #909 marks
   it human-reviewed/follow-up, and it carries a real risk of fragmenting the locator model
   if rushed. Wave 0's deliverable is this ADR + the review.

### Consequences

- Introduces a **second resolution channel** alongside the CSS seam. This is the first
  locator that does not reduce to one CSS string — a deliberate, contained crack in the
  CSS-only invariant, justified because the accname output genuinely is not CSS.
- The CSS path stays the default and zero-overhead; the name-aware path is opt-in and only
  pays the accname cost when used.
- Cross-engine accname parity is a follow-up risk to verify: Playwright and
  `@testing-library/dom` both implement accname but may differ on edge cases — that
  validation belongs to the implementation wave, not Wave 0.

### Test strategy (for the follow-up wave)

- Components whose name is **computed** (via `aria-labelledby`, associated `<label>`,
  wrapping text) resolve correctly in jsdom **and** all three Playwright browsers — the
  cross-engine accname-parity proof.
- Verbatim-`aria-label` cases keep resolving via the step-2 CSS stopgap unchanged
  (regression guard that the new channel does not cannibalize the CSS path).

### Migration / compatibility note

When `BYROLE_NAME(b)` lands, the step-2 `byRole(value, { name })` CSS stopgap stays valid
and unchanged for verbatim-`aria-label` widgets; the accname-correct path is **additive**.
No breaking change is anticipated. Wave 0 ships **only this ADR** for Decision B.
