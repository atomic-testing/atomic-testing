import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx MetadataList (`@astryxdesign/core/MetadataList`).
 *
 * MetadataList self-emits `data-testid` on its root `<div>` and renders entries as
 * a `<dl>` of alternating `<dt>` (label) / `<dd>` (value) pairs. The two tags
 * interleave, so the n-th entry is `dt:nth-of-type(n)` paired with
 * `dd:nth-of-type(n)`; there is no per-entry testid by default, so values are
 * looked up by their label text. Roles come from the native definition-list
 * semantics — never StyleX-hashed classes.
 *
 * When `maxNumOfItems` collapses the list, the hidden entries are **not rendered**
 * (not merely hidden), so {@link getEntryCount}/{@link getLabels} report only the
 * visible entries until {@link showMore} expands them. {@link isExpanded} reads the
 * "Show more"/"Show less" toggle's `aria-expanded`.
 */
export class MetadataListDriver extends ComponentDriver {
  private dt(index: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`dl dt:nth-of-type(${index})`));
  }

  private dd(index: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`dl dd:nth-of-type(${index})`));
  }

  /** The "Show more" / "Show less" toggle (present only when `maxNumOfItems` collapses the list). */
  private get toggle(): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector('button[aria-controls]'));
  }

  /** Number of currently rendered entries (collapsed entries are not in the DOM). */
  async getEntryCount(): Promise<number> {
    let count = 0;
    for (let i = 1; await this.interactor.exists(this.dt(i)); i++) {
      count++;
    }
    return count;
  }

  /** Every rendered entry's label, in DOM order. */
  async getLabels(): Promise<readonly string[]> {
    const labels: string[] = [];
    for (let i = 1; ; i++) {
      const dt = this.dt(i);
      if (!(await this.interactor.exists(dt))) {
        break;
      }
      const label = (await this.interactor.getText(dt))?.trim();
      if (label != null) {
        labels.push(label);
      }
    }
    return labels;
  }

  /** The value (`<dd>`) for the entry whose label (`<dt>`) matches, or `undefined` when absent. */
  async getValueByLabel(label: string): Promise<Optional<string>> {
    for (let i = 1; ; i++) {
      const dt = this.dt(i);
      if (!(await this.interactor.exists(dt))) {
        break;
      }
      if ((await this.interactor.getText(dt))?.trim() === label) {
        return (await this.interactor.getText(this.dd(i)))?.trim();
      }
    }
    return undefined;
  }

  /** Whether the list is expanded — `false` when there is no toggle or it is collapsed. */
  async isExpanded(): Promise<boolean> {
    if (!(await this.interactor.exists(this.toggle))) {
      return false;
    }
    return (await this.interactor.getAttribute(this.toggle, 'aria-expanded')) === 'true';
  }

  /** Expand the collapsed list, revealing the hidden entries. No-op when already expanded or uncollapsible. */
  async showMore(): Promise<void> {
    if ((await this.interactor.exists(this.toggle)) && !(await this.isExpanded())) {
      await this.interactor.click(this.toggle);
    }
  }

  /** Collapse the list back to `maxNumOfItems`. No-op when already collapsed or uncollapsible. */
  async showLess(): Promise<void> {
    if (await this.isExpanded()) {
      await this.interactor.click(this.toggle);
    }
  }

  override get driverName(): string {
    return 'AstryxMetadataListDriver';
  }
}
