import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx AppShell (`@astryxdesign/core/AppShell`).
 *
 * AppShell is a layout orchestrator with almost no testable surface of its own —
 * it slots a `topNav`, a `sideNav`, and `children` into landmark regions and
 * delegates behaviour to those child components. The scene anchors this driver on
 * the root (`data-testid`, `data-variant`); its job is to confirm the regions are
 * mounted and expose the variant, then hand off to the child drivers (TopNav,
 * SideNav, etc.) for real interaction.
 *
 * The landmark anchors are stable and semantic — `role="main"` /
 * `#astryx-app-shell-main` for content, a generated skip link, and the prefixed
 * `astryx-app-shell-header` / `astryx-app-shell-sidenav` region classes (used only
 * as a last resort, since these regions expose no role/testid). Responsive
 * collapse and the mobile drawer are CSS/viewport-gated and therefore **E2E-only**.
 */
export class AppShellDriver extends ComponentDriver<{}> {
  private region(selector: string): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(selector));
  }

  /** The shell variant (`data-variant`, e.g. `'elevated'`). */
  async getVariant(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'data-variant');
  }

  /** Whether a header/top-nav region is mounted. */
  async hasHeader(): Promise<boolean> {
    return this.interactor.exists(this.region('.astryx-app-shell-header'));
  }

  /** Whether a side-nav region is mounted. */
  async hasSideNav(): Promise<boolean> {
    return this.interactor.exists(this.region('.astryx-app-shell-sidenav'));
  }

  /** Whether the main content landmark (`role="main"`) is mounted. */
  async hasMain(): Promise<boolean> {
    return this.interactor.exists(this.region('[role="main"]'));
  }

  /** The main content's text, read from the `role="main"` landmark. */
  async getMainText(): Promise<Optional<string>> {
    const main = this.region('[role="main"]');
    if (!(await this.interactor.exists(main))) {
      return undefined;
    }
    return (await this.interactor.getText(main)) ?? undefined;
  }

  /** Whether the built-in "skip to content" link is present. */
  async hasSkipLink(): Promise<boolean> {
    return this.interactor.exists(this.region('[data-testid="skip-to-content"]'));
  }

  get driverName(): string {
    return 'AstryxAppShellDriver';
  }
}
