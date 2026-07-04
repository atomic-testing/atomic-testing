import { provideZoneChangeDetection, provideZonelessChangeDetection, Type } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { byAttribute, ScenePart, TestEngine } from '@atomic-testing/core';

import { AngularInteractor } from './AngularInteractor';
import { settleAppStability } from './settling';
import { IAngularRenderedTestEngineOption, IAngularTestEngineOption } from './types';

let _rootId = 0;
function getNextRootElementId() {
  return `${_rootId++}`;
}

const rootElementAttributeName = 'data-atomic-testing-angular';

function isZoneJsLoaded(): boolean {
  return typeof (globalThis as { Zone?: unknown }).Zone !== 'undefined';
}

/**
 * Create a test engine for a standalone Angular component (Angular 20+).
 *
 * The component is mounted through Angular's real bootstrap API
 * (`createApplication` + `ApplicationRef.bootstrap`) rather than `TestBed`,
 * mirroring how the React adapters use `createRoot` rather than a testing
 * harness. Bootstrapping is asynchronous in Angular, so unlike the React/Vue
 * adapters this function returns a `Promise` — `await` it in your setup hook.
 *
 * Change detection mode follows the environment: when zone.js is loaded the
 * app bootstraps zone-based (Angular's default); when it is not,
 * `provideZonelessChangeDetection()` is added automatically. Pass explicit
 * providers via `option.providers` to override (e.g. force zoneless with
 * zone.js present).
 *
 * @param component The standalone component class to bootstrap
 * @param partDefinitions The scene part definitions
 * @param option
 * @returns Promise of the test engine
 */
export async function createTestEngine<T extends ScenePart>(
  component: Type<unknown>,
  partDefinitions: T,
  option?: Readonly<Partial<IAngularTestEngineOption>>
): Promise<TestEngine<T>> {
  const rootEl = option?.rootElement ?? document.body;
  const container = rootEl.appendChild(document.createElement('div'));
  const rootId = getNextRootElementId();
  container.setAttribute(rootElementAttributeName, rootId);

  // The host node is passed to bootstrap() directly, so the component's
  // selector never has to be resolved or present in the page.
  const host = container.appendChild(document.createElement('div'));

  // Auto-detected mode first, caller-supplied providers after — in Angular DI
  // the later provider wins, so option.providers can override the detection.
  //
  // Always provide one explicitly — never rely on createApplication()'s own
  // default. Angular 20's internalCreateApplication() defaults to zone-based
  // CD, but Angular 21+ defaults to provideZonelessChangeDetectionInternal()
  // regardless of whether zone.js is loaded, so merely loading zone.js is not
  // enough on 21+ to get zone-based change detection (confirmed by diffing
  // internalCreateApplication's baseline providers across majors). Stating
  // our own choice explicitly makes this version-independent.
  const providers = [
    isZoneJsLoaded() ? provideZoneChangeDetection() : provideZonelessChangeDetection(),
    ...(option?.providers ?? []),
  ];

  try {
    const appRef = await createApplication({ providers });
    appRef.bootstrap(component, host);

    // Let the initial render settle before handing the engine out.
    await settleAppStability(appRef, option?.settleTimeoutMs);

    const cleanup = () => {
      appRef.destroy();
      rootEl.removeChild(container);
      return Promise.resolve();
    };

    return new TestEngine(
      byAttribute(rootElementAttributeName, rootId),
      new AngularInteractor(appRef, undefined, { settleTimeoutMs: option?.settleTimeoutMs }),
      {
        parts: partDefinitions,
      },
      cleanup
    );
  } catch (error) {
    rootEl.removeChild(container);
    throw error;
  }
}

/**
 * Create a test engine for an element already rendered by an Angular
 * application bootstrapped elsewhere (e.g. a Storybook-style host).
 *
 * Pass the host's `ApplicationRef` via `option.applicationRef` so
 * interactions settle on real app stability; without it the interactor falls
 * back to yielding a macrotask after each interaction.
 *
 * @param rootElement The root HTML element rendered by Angular
 * @param partDefinitions The scene part definitions
 * @param option
 * @returns The test engine
 */
export function createRenderedTestEngine<T extends ScenePart>(
  rootElement: HTMLElement,
  partDefinitions: T,
  option?: Readonly<Partial<IAngularRenderedTestEngineOption>>
): TestEngine<T> {
  const rootId = getNextRootElementId();
  rootElement.setAttribute(rootElementAttributeName, rootId);

  const cleanup = () => {
    rootElement.removeAttribute(rootElementAttributeName);
    return Promise.resolve();
  };

  const engine = new TestEngine(
    byAttribute(rootElementAttributeName, rootId),
    new AngularInteractor(option?.applicationRef, undefined, { settleTimeoutMs: option?.settleTimeoutMs }),
    {
      parts: partDefinitions,
    },
    cleanup
  );

  return engine;
}
