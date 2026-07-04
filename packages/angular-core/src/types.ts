import type { EnvironmentProviders, Provider } from '@angular/core';
import { ITestEngineOption } from '@atomic-testing/core';
import { DOMInteractorOption } from '@atomic-testing/dom-core';

/**
 * The minimal stability contract `AngularInteractor` settles against,
 * structurally satisfied by Angular's `ApplicationRef` (Angular 20+).
 *
 * Kept structural on purpose: the interactor itself has no dependency on
 * `@angular/core`, and `ApplicationRef.whenStable()` already abstracts over
 * zone.js vs. zoneless change detection — it resolves once change detection
 * is idle in either mode.
 */
export interface AngularAppStability {
  whenStable(): Promise<void>;
}

/**
 * Construction options for `AngularInteractor`.
 */
export interface AngularInteractorOption extends DOMInteractorOption {
  /**
   * Upper bound (in milliseconds) on how long a single interaction waits for
   * the application to stabilize. Guards against apps that never stabilize
   * (e.g. `setInterval` polling inside the zone) deadlocking every
   * interaction; the polling `waitUntil` path remains the safety net.
   * @defaultValue 3000
   */
  readonly settleTimeoutMs?: number;
}

/**
 * Options for the Angular `createTestEngine`.
 */
export interface IAngularTestEngineOption extends ITestEngineOption {
  /**
   * Extra providers passed to the bootstrapped application, e.g.
   * `provideZonelessChangeDetection()` to force zoneless in a zone.js-loaded
   * environment, router/http test providers, etc.
   */
  providers?: Array<Provider | EnvironmentProviders>;

  /** See {@link AngularInteractorOption.settleTimeoutMs}. */
  settleTimeoutMs?: number;
}

/**
 * Options for `createRenderedTestEngine`, where the host environment (not the
 * engine) bootstrapped the application.
 */
export interface IAngularRenderedTestEngineOption {
  /**
   * The `ApplicationRef` of the already-bootstrapped application. When
   * provided, interactions settle via `whenStable()`; when omitted the
   * interactor falls back to yielding a macrotask after each interaction.
   */
  applicationRef?: AngularAppStability;

  /** See {@link AngularInteractorOption.settleTimeoutMs}. */
  settleTimeoutMs?: number;
}
