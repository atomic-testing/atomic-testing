import { childListHelper, ComponentDriver } from '@atomic-testing/core';

import { ToolbarButtonDriver } from './ToolbarButtonDriver';

const buttonSelector = '.fui-Button';
const dividerSelector = '.fui-Divider';
const groupWrapperSelector = '.fui-ToolbarGroup';

/**
 * Driver for the Fluent v9 `Toolbar` (holding `ToolbarButton`/
 * `ToolbarDivider`/`ToolbarRadioGroup` children — see
 * {@link ToolbarButtonDriver}, {@link ToolbarDividerDriver},
 * {@link ToolbarRadioGroupDriver}).
 *
 * DOM audit (@fluentui/react-components@9.8.3): root is
 * `<div role="toolbar">`, class `fui-Toolbar`; `aria-orientation="vertical"`
 * is present ONLY when `vertical` is set — the horizontal default omits the
 * attribute entirely rather than stamping `"horizontal"` — so
 * {@link getOrientation} returns a defaulted, semantic value rather than a
 * raw (often-`null`) attribute passthrough.
 *
 * **Button enumeration walks through `ToolbarGroup`/`ToolbarRadioGroup`
 * wrappers**: `ToolbarButton`/`ToolbarToggleButton`/`ToolbarRadioButton` all
 * share the identical `fui-Button` class (none stamps its own
 * `fui-ToolbarButton`-style class — DOM audit), so
 * {@link getButtonByLabel} matches any of them by that shared class,
 * descending one level into `.fui-ToolbarGroup` wrappers (the only wrapper
 * type a `Toolbar`'s direct children can be) via `childListHelper`'s
 * `groupSelector` recursion — a caller who specifically needs
 * `aria-checked`-aware access to a radio button should reach it via a scene-
 * declared {@link ToolbarRadioGroupDriver} instead.
 */
export class ToolbarDriver extends ComponentDriver<{}> {
  /** The toolbar's orientation (Fluent omits `aria-orientation` entirely when horizontal — the default). */
  async getOrientation(): Promise<'horizontal' | 'vertical'> {
    const value = await this.interactor.getAttribute(this.locator, 'aria-orientation');
    return value === 'vertical' ? 'vertical' : 'horizontal';
  }

  /** The number of buttons (plain, toggle, or radio) anywhere in the toolbar, including inside group wrappers. */
  async getButtonCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, buttonSelector, groupWrapperSelector);
  }

  /** The number of dividers directly in the toolbar. */
  async getDividerCount(): Promise<number> {
    return childListHelper.countMatchingChildren(this.interactor, this.locator, dividerSelector, groupWrapperSelector);
  }

  /**
   * The first button (of any kind — see class doc) whose visible label
   * matches `label`, or `null` when absent.
   */
  async getButtonByLabel(label: string): Promise<ToolbarButtonDriver | null> {
    for await (const button of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      buttonSelector,
      ToolbarButtonDriver,
      groupWrapperSelector
    )) {
      const text = await button.getText();
      if (text?.trim() === label) {
        return button;
      }
    }
    return null;
  }

  get driverName(): string {
    return 'FluentV9ToolbarDriver';
  }
}
