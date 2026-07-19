import {
  byRole,
  IComponentDriverOption,
  Interactor,
  ListComponentDriver,
  ListComponentDriverSpecificOption,
  listHelper,
  Nullable,
  PartLocator,
} from '@atomic-testing/core';

import { ToolbarRadioButtonDriver } from './ToolbarRadioButtonDriver';

/**
 * `ToolbarRadioButton`s are located by `role="radio"` — `ToolbarRadioGroup`
 * (`useToolbarGroup_unstable({role: 'radiogroup', ...})`) renders no
 * interleaved non-radio siblings, so `ListComponentDriver`'s `:nth-of-type`
 * addressing is safe here.
 */
export const defaultToolbarRadioGroupDriverOption: ListComponentDriverSpecificOption<ToolbarRadioButtonDriver> = {
  itemClass: ToolbarRadioButtonDriver,
  itemLocator: byRole('radio'),
};

type ToolbarRadioGroupDriverOption<ItemT extends ToolbarRadioButtonDriver> = ListComponentDriverSpecificOption<ItemT> &
  Partial<IComponentDriverOption<any>>;

/**
 * Driver for the Fluent v9 `ToolbarRadioGroup` (holding `ToolbarRadioButton`
 * children — see {@link ToolbarRadioButtonDriver}).
 *
 * DOM audit (@fluentui/react-components@9.8.3): `ToolbarRadioGroup` IS
 * `ToolbarGroup` with `role="radiogroup"` forced on — it shares
 * `ToolbarGroup`'s own class (`fui-ToolbarGroup`), no dedicated
 * `fui-ToolbarRadioGroup` class is exported — so, unlike native-`<input>`-backed
 * `RadioGroupDriver`, this driver cannot delegate to
 * `HTMLRadioButtonGroupDriver` (there is no `:checked`/`[value=]` to filter
 * on; selection is `role="radio"`/`aria-checked` on real `<button>`s
 * instead). A {@link ListComponentDriver} over those buttons is the natural
 * fit, mirroring {@link TabListDriver}'s shape.
 */
export class ToolbarRadioGroupDriver<
  ItemT extends ToolbarRadioButtonDriver = ToolbarRadioButtonDriver,
> extends ListComponentDriver<ItemT> {
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    option: Partial<ToolbarRadioGroupDriverOption<ItemT>> = {}
  ) {
    // Merged in (not a default parameter) for the same reason as TabListDriver:
    // the test engine always passes an option object for a scene part.
    super(locator, interactor, {
      ...defaultToolbarRadioGroupDriverOption,
      ...option,
    } as ToolbarRadioGroupDriverOption<ItemT>);
  }

  /** The visible label of every option, in DOM order. */
  async getOptionLabels(): Promise<string[]> {
    const labels: string[] = [];
    for await (const item of listHelper.getListItemIterator(this, this.getItemLocator(), ToolbarRadioButtonDriver)) {
      labels.push((await item.getText())?.trim() ?? '');
    }
    return labels;
  }

  /** Label of the selected option, or `null` when none is selected. */
  async getSelectedLabel(): Promise<Nullable<string>> {
    for await (const item of listHelper.getListItemIterator(this, this.getItemLocator(), ToolbarRadioButtonDriver)) {
      if (await item.isSelected()) {
        return (await item.getText())?.trim() ?? null;
      }
    }
    return null;
  }

  /**
   * Select the first option whose visible label equals `label`.
   * @returns `false` when no option matches.
   */
  async selectByLabel(label: string): Promise<boolean> {
    const item = await this.getItemByLabel(label);
    if (item == null) {
      return false;
    }
    await item.setSelected(true);
    return true;
  }

  override get driverName(): string {
    return 'FluentV9ToolbarRadioGroupDriver';
  }
}
