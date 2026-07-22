import { byCssSelector, locatorUtil, PartLocator } from '@atomic-testing/core';

import { InfoButtonDriver } from './InfoButtonDriver';
import { LabelDriver } from './LabelDriver';

/**
 * Driver for the Fluent v9 `InfoLabel` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): `label` is the PRIMARY slot
 * — every native prop given directly to `<InfoLabel>` (including a
 * `data-testid`/scene locator) forwards onto the inner
 * `<label class="fui-Label fui-InfoLabel__label">`, NOT the wrapping
 * `<span class="fui-InfoLabel">`. The label and its `InfoButton` sibling are
 * true DOM siblings under that wrapping span (the button is not nested
 * inside the label), so the inherited `getText()` already excludes the
 * button's own text — no folding needed, unlike `MessageBarDriver`/
 * `AlertDriver`. This driver extends {@link LabelDriver} wholesale for that
 * `getText()`/`getFor()` surface and adds {@link getInfoButton} to reach the
 * sibling button, re-rooted at the enclosing `.fui-InfoLabel` wrapper via
 * `:has()` (same technique `SearchBoxDriver` uses for its own implicit
 * wrapper) so two side-by-side `InfoLabel`s stay disambiguated.
 */
export class InfoLabelDriver extends LabelDriver {
  private get infoButtonLocator(): PartLocator {
    const chain = this.locator;
    const selfSelector = chain[chain.length - 1].selector;
    return locatorUtil.append(chain.slice(0, -1), byCssSelector(`.fui-InfoLabel:has(${selfSelector}) .fui-InfoButton`));
  }

  /** The `InfoButton` this label renders (its `info` prop content, reached via the button's popover). */
  getInfoButton(): InfoButtonDriver {
    return new InfoButtonDriver(this.infoButtonLocator, this.interactor, this.commutableOption);
  }

  override get driverName(): string {
    return 'FluentV9InfoLabelDriver';
  }
}
