import { ANIMATION_MODULE_TYPE, Type } from '@angular/core';
import { createTestEngine as bootstrapTestEngine, IAngularTestEngineOption } from '@atomic-testing/angular-21';
import { ScenePart, TestEngine } from '@atomic-testing/core';

/**
 * Bootstraps every example in this package through
 * `@atomic-testing/angular-21`'s `createTestEngine`, with animations disabled
 * by default.
 *
 * Material's real CSS animations (e.g. `mat-menu`'s ~120ms enter transition)
 * apply `pointer-events: none` to the animating panel, cleared only by a real
 * `animationend` event — Material has a JS fallback timer for the *close*
 * path but none for *open*. Under CI load that event can be delayed past
 * `MenuItemDriver.click()`'s defensive wait (which times out silently rather
 * than throwing), so the click proceeds while pointer events are still
 * suppressed and hits `@testing-library/user-event`'s own guard — the
 * intermittent `MatMenu` "activating an item" failure this wrapper exists to
 * eliminate.
 *
 * `ANIMATION_MODULE_TYPE: 'NoopAnimations'` is what every Material component
 * itself reads (via `_animationsDisabled()`, see `@angular/material/core`) to
 * decide whether to run its real CSS animation at all — it does not go
 * through `@angular/platform-browser/animations`' `provideNoopAnimations()`,
 * which additionally pulls in `@angular/animations/browser`'s renderer
 * factory, a package this workspace does not otherwise depend on. Setting
 * just the token Material already consults disables the animation classes
 * (and the pointer-events race with them) without that extra dependency.
 * Every affected driver already waits on DOM/attribute state via `waitUntil`
 * rather than a fixed animation duration, so resolving that state sooner is
 * safe, not just faster.
 *
 * `option.providers`, when supplied, is appended after this provider, so a
 * caller can still override it (Angular DI: later provider wins).
 */
export function createTestEngine<T extends ScenePart>(
  component: Type<unknown>,
  partDefinitions: T,
  option?: Readonly<Partial<IAngularTestEngineOption>>
): Promise<TestEngine<T>> {
  return bootstrapTestEngine(component, partDefinitions, {
    ...option,
    providers: [{ provide: ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations' }, ...(option?.providers ?? [])],
  });
}
