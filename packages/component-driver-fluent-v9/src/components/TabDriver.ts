import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { byCssClass, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

const contentLocator = byCssClass('fui-Tab__content');

/**
 * Driver for a single Fluent v9 `Tab` (a child of `TabList` — see {@link TabListDriver}).
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a real
 * `<button role="tab" type="button" class="fui-Tab" value="...">` — the
 * `value` prop is spread straight onto the native `value` attribute (unlike
 * `Option.value` elsewhere in this package, e.g. `ComboboxDriver`'s Known
 * Gaps, this one genuinely reflects), so {@link getValue} is a reliable,
 * un-hashed read. `aria-selected` is `"true"`/`"false"` when the tab is
 * enabled, but the ATTRIBUTE IS ABSENT ENTIRELY when the tab is disabled —
 * {@link isSelected} treats the absent case as `false`, since a disabled tab
 * cannot legitimately be the interactively-selected one.
 *
 * **`getText()` is overridden to avoid a real DOM-verified duplicate-text
 * trap**: `Tab` renders its label inside `<span class="fui-Tab__content">`,
 * but — when `reserveSelectedTabSpace` (default `true`) and the tab is NOT
 * selected — Fluent ALSO renders an invisible
 * `<span class="fui-Tab__content--reserved-space">` holding a SECOND copy of
 * the same label text, purely to reserve layout width so selecting the tab
 * (which bolds it) doesn't shift the layout. The inherited `getText()`
 * (`ComponentDriver`'s plain `textContent` read on the whole `<button>`)
 * would read BOTH spans concatenated (verified: an unselected tab's label
 * comes back doubled, e.g. `"ProfileProfile"`), so this driver reads
 * `.fui-Tab__content` specifically instead — a distinct CSS class token, not
 * a prefix match, so the reserved-space span is never included. Falls back
 * to the inherited whole-button read when `.fui-Tab__content` is absent
 * (an icon-only tab renders no content span at all).
 *
 * Unlike a toggle button this is intentionally not an `IToggleDriver`: a tab
 * can be selected but not toggled off (selecting another tab deselects it),
 * so only `isSelected`/`select` are exposed, mirroring
 * `component-driver-mui-v9`'s `TabDriver`.
 */
export class TabDriver extends HTMLButtonDriver {
  private get contentLocator(): PartLocator {
    return locatorUtil.append(this.locator, contentLocator);
  }

  /** The tab's visible label — see class doc for why this is overridden rather than inherited. */
  override async getText(): Promise<Optional<string>> {
    if (await this.interactor.exists(this.contentLocator)) {
      return this.interactor.getText(this.contentLocator);
    }
    return super.getText();
  }

  /** Whether this tab is the selected one. `false` (not merely unknown) when disabled — see class doc. */
  async isSelected(): Promise<boolean> {
    const val = await this.interactor.getAttribute(this.locator, 'aria-selected');
    return val === 'true';
  }

  /** This tab's `value`, reflected verbatim onto the native `value` attribute — see class doc. */
  async getValue(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'value');
  }

  /**
   * Activate this tab by clicking it, unless it is already selected (a
   * selected tab cannot be toggled off). No-ops on a disabled tab rather
   * than clicking it regardless: under jsdom, `userEvent.click` already
   * silently skips a disabled native `<button>`, but
   * `PlaywrightInteractor.click`'s actionability check instead retries "is
   * enabled" until the click's own timeout — indistinguishable from a hang
   * for a tab that can never become enabled (same contract as
   * `RadioDriver.setSelected`/`AccordionItemDriver.click`).
   */
  async select(): Promise<void> {
    if (await this.isSelected()) {
      return;
    }
    if (await this.isDisabled()) {
      return;
    }
    await this.interactor.click(this.locator);
  }

  override get driverName(): string {
    return 'FluentV9TabDriver';
  }
}
