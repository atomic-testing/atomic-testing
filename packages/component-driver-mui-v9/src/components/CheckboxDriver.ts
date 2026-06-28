import { HTMLCheckboxDriver } from '@atomic-testing/component-driver-html';
import {
  byCssSelector,
  byTagName,
  ComponentDriver,
  IComponentDriverOption,
  IFormFieldDriver,
  Interactor,
  IToggleDriver,
  locatorUtil,
  Optional,
  PartLocator,
  ScenePart,
  ScenePartDriver,
} from '@atomic-testing/core';

export const checkboxPart = {
  checkbox: {
    locator: byTagName('input'),
    driver: HTMLCheckboxDriver,
  },
} satisfies ScenePart;

export type CheckboxScenePart = typeof checkboxPart;
export type CheckboxScenePartDriver = ScenePartDriver<CheckboxScenePart>;

export class CheckboxDriver
  extends ComponentDriver<CheckboxScenePart>
  implements IFormFieldDriver<string | null>, IToggleDriver
{
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: checkboxPart,
    });
  }
  isSelected(): Promise<boolean> {
    return this.parts.checkbox.isSelected();
  }
  async setSelected(selected: boolean): Promise<void> {
    const isIndeterminate = await this.isIndeterminate();
    if (isIndeterminate && selected === false) {
      // if the checkbox is indeterminate and we want to set it to false, we need to click it twice
      // this is done through setting it to true first, then to false
      await this.parts.checkbox.setSelected(true);
    }

    await this.parts.checkbox.setSelected(selected);
  }

  getValue(): Promise<string | null> {
    return this.parts.checkbox.getValue();
  }

  async isIndeterminate(): Promise<boolean> {
    const indeterminate = await this.interactor.getAttribute(this.parts.checkbox.locator, 'data-indeterminate');
    return indeterminate === 'true';
  }

  isDisabled(): Promise<boolean> {
    return this.parts.checkbox.isDisabled();
  }

  isReadonly(): Promise<boolean> {
    return this.parts.checkbox.isReadonly();
  }

  /**
   * Get the text of the label associated with the checkbox, or `undefined` when the checkbox
   * is rendered without one (e.g. a bare `<Checkbox>` outside of a `FormControlLabel`).
   *
   * MUI's `FormControlLabel` does not expose a `for`/`id` or `aria-labelledby` association; it
   * labels the control implicitly by wrapping it in a `<label>` and rendering the text as a
   * sibling. The label therefore lives outside this driver's own subtree, so we re-root at the
   * enclosing `<label>` — matched against this checkbox via `:has()`, while preserving the
   * surrounding scope — and read its text. This resolves to a single CSS selector, so it behaves
   * identically across every interactor (DOM/React/Vue and Playwright).
   */
  async getLabel(): Promise<Optional<string>> {
    const labelLocator = this.getEnclosingLabelLocator();
    const hasLabel = await this.interactor.exists(labelLocator);
    return hasLabel ? this.interactor.getText(labelLocator) : undefined;
  }

  /**
   * Build a locator for the `<label>` that encloses this checkbox, scoped to the same ancestor
   * context as the checkbox itself so that sibling checkboxes are never mismatched.
   */
  private getEnclosingLabelLocator(): PartLocator {
    const chain = locatorUtil.toChain(this.locator);
    const selfSelector = chain[chain.length - 1].selector;
    return locatorUtil.append(chain.slice(0, -1), byCssSelector(`label:has(${selfSelector})`));
  }

  get driverName(): string {
    return 'MuiV9CheckboxDriver';
  }
}
