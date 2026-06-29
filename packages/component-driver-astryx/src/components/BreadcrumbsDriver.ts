import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Driver for the Astryx Breadcrumbs (`@astryxdesign/core/Breadcrumbs`).
 *
 * Breadcrumbs is a `<nav aria-label="Breadcrumb" class="astryx-breadcrumbs">` that
 * forwards `data-testid` onto its root and wraps an `<ol>` of
 * `<li class="astryx-breadcrumb-item">`. A linked crumb holds an `<a href>`; the
 * current crumb holds a `<span aria-current="page">` instead — note the
 * `aria-current` lives on that inner `<span>`, never the `<li>`. Crumbs are
 * enumerated positionally with the iterate-with-`exists` idiom (there is no
 * per-crumb testid by default), and the whole trail is rendered in the DOM, so
 * every read is faithful in jsdom.
 */
export class BreadcrumbsDriver extends ComponentDriver<{}> {
  private crumb(index: number): PartLocator {
    return locatorUtil.append(this.locator, byCssSelector(`li.astryx-breadcrumb-item:nth-of-type(${index})`));
  }

  /** The accessible name of the breadcrumb landmark (`aria-label`, default "Breadcrumb"). */
  async getLabel(): Promise<Optional<string>> {
    return this.interactor.getAttribute(this.locator, 'aria-label');
  }

  /** Number of crumbs in the trail. */
  async getItemCount(): Promise<number> {
    let count = 0;
    for (let i = 1; await this.interactor.exists(this.crumb(i)); i++) {
      count++;
    }
    return count;
  }

  /**
   * Every crumb's visible label, in DOM order. The label is read from the crumb's
   * `<a>` (linked) or, failing that, its `<span aria-current="page">` (current)
   * child rather than the whole `<li>`, so the decorative `aria-hidden` "/"
   * separator is excluded. The two are probed separately (not as one `a,
   * [aria-current]` selector list) so each stays scoped to this crumb.
   */
  async getLabels(): Promise<readonly string[]> {
    const labels: string[] = [];
    for (let i = 1; await this.interactor.exists(this.crumb(i)); i++) {
      const link = locatorUtil.append(this.crumb(i), byCssSelector('a'));
      const labelEl = (await this.interactor.exists(link))
        ? link
        : locatorUtil.append(this.crumb(i), byCssSelector('[aria-current="page"]'));
      const label = (await this.interactor.getText(labelEl))?.trim();
      if (label) {
        labels.push(label);
      }
    }
    return labels;
  }

  /**
   * The current crumb's label — read from the descendant `[aria-current="page"]`
   * (an inner `<span>`), or `undefined` when no crumb is marked current.
   */
  async getCurrentLabel(): Promise<Optional<string>> {
    const current = locatorUtil.append(this.locator, byCssSelector('[aria-current="page"]'));
    if (!(await this.interactor.exists(current))) {
      return undefined;
    }
    return (await this.interactor.getText(current))?.trim();
  }

  /** Every linked crumb's `href`, in DOM order (the current crumb has no link, so it is skipped). */
  async getHrefs(): Promise<readonly string[]> {
    const hrefs: string[] = [];
    for (let i = 1; await this.interactor.exists(this.crumb(i)); i++) {
      const link = locatorUtil.append(this.crumb(i), byCssSelector('a'));
      if (await this.interactor.exists(link)) {
        const href = await this.interactor.getAttribute(link, 'href');
        if (href != null) {
          hrefs.push(href);
        }
      }
    }
    return hrefs;
  }

  get driverName(): string {
    return 'AstryxBreadcrumbsDriver';
  }
}
