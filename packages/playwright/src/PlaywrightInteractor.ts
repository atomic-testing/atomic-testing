import {
  byCssSelector,
  ClickOption,
  CssProperty,
  EnterTextOption,
  HoverOption,
  Interactor,
  locatorUtil,
  MouseDownOption,
  MouseMoveOption,
  MouseUpOption,
  Optional,
  PartLocator,
  timingUtil,
} from '@atomic-testing/core';
import { MouseEnterOption, MouseLeaveOption, MouseOutOption } from '@atomic-testing/core/src/interactor/MouseOption';
import { Page } from '@playwright/test';

export class PlaywrightInteractor implements Interactor {
  constructor(public readonly page: Page) {}

  async selectOptionValue(locator: PartLocator, values: string[]): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    await this.page.locator(cssLocator).selectOption(values);
  }

  async getInputValue(locator: PartLocator): Promise<Optional<string>> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    return this.page.locator(cssLocator).inputValue();
  }

  async getSelectValues(locator: PartLocator): Promise<Optional<readonly string[]>> {
    const optionLocator: PartLocator = byCssSelector('option:checked');
    const selectedOptionLocator = locatorUtil.append(locator, optionLocator);
    const cssLocator = await locatorUtil.toCssSelector(selectedOptionLocator, this);
    const allOptions = await this.page.locator(cssLocator).all();
    const values: string[] = [];
    for (const option of allOptions) {
      const value = await option.getAttribute('value');
      if (value != null) {
        values.push(value);
      }
    }
    return values;
  }

  async getSelectLabels(locator: PartLocator): Promise<Optional<readonly string[]>> {
    const optionLocator: PartLocator = byCssSelector('option:checked');
    const selectedOptionLocator = locatorUtil.append(locator, optionLocator);
    const cssLocator = await locatorUtil.toCssSelector(selectedOptionLocator, this);
    const allOptions = await this.page.locator(cssLocator).all();
    const labels: string[] = [];
    for (const option of allOptions) {
      const label = await option.textContent();
      if (label != null) {
        labels.push(label);
      }
    }
    return labels;
  }

  async getStyleValue(locator: PartLocator, propertyName: CssProperty): Promise<Optional<string>> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const elLocator = this.page.locator(cssLocator);
    const value = await elLocator.evaluate((element, prop) => {
      return window.getComputedStyle(element).getPropertyValue(prop as string);
    }, propertyName);
    return value;
  }

  async enterText(locator: PartLocator, text: string, option?: Optional<Partial<EnterTextOption>>): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    if (!option?.append) {
      await this.page.locator(cssLocator).clear();
    }
    await this.page.locator(cssLocator).type(text);
  }

  async click(locator: PartLocator, option?: Partial<ClickOption>): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    await this.page.locator(cssLocator).click({ position: option?.position });
  }

  async hover(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    await this.page.locator(cssLocator).hover({ position: option?.position });
  }

  async mouseMove(locator: PartLocator, option?: Partial<MouseMoveOption>): Promise<void> {
    await this.hover(locator, {
      position: option?.position,
    });
    await this.page.mouse.move(0, 0);
  }

  async mouseDown(locator: PartLocator, option?: Partial<MouseDownOption>): Promise<void> {
    await this.hover(locator, {
      position: option?.position,
    });
    await this.page.mouse.down();
  }

  async mouseUp(locator: PartLocator, option?: Partial<MouseUpOption>): Promise<void> {
    await this.hover(locator, {
      position: option?.position,
    });
    await this.page.mouse.up();
  }

  async mouseOver(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    return this.hover(locator, option);
  }

  async mouseOut(locator: PartLocator, _option?: Partial<MouseOutOption>): Promise<void> {
    await this.hover(locator, {
      position: {
        x: 0,
        y: 0,
      },
    });
    await this.page.mouse.move(-10, -10);
  }

  async mouseEnter(locator: PartLocator, _option?: Partial<MouseEnterOption>): Promise<void> {
    return this.hover(locator);
  }

  async mouseLeave(locator: PartLocator, _option?: Partial<MouseLeaveOption>): Promise<void> {
    return this.mouseOut(locator);
  }

  wait(ms: number): Promise<void> {
    return timingUtil.wait(ms);
  }

  async getAttribute(locator: PartLocator, name: string, isMultiple: true): Promise<readonly string[]>;
  async getAttribute(locator: PartLocator, name: string, isMultiple: false): Promise<Optional<string>>;
  async getAttribute(locator: PartLocator, name: string): Promise<Optional<string>>;
  async getAttribute(
    locator: PartLocator,
    name: string,
    isMultiple?: boolean,
  ): Promise<Optional<string> | readonly string[]> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const elLocator = this.page.locator(cssLocator);
    if (isMultiple) {
      const locators = await elLocator.all();
      const values: string[] = [];
      for (const locator of locators) {
        const value = await locator.getAttribute(name);
        if (value != null) {
          values.push(value);
        }
      }
      return values;
    }
    const value = await elLocator.getAttribute(name);
    return value ?? undefined;
  }

  async getText(locator: PartLocator): Promise<Optional<string>> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const text = await this.page.locator(cssLocator).textContent();
    return text ?? undefined;
  }

  async exists(locator: PartLocator): Promise<boolean> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const count = await this.page.locator(cssLocator).count();
    return count > 0;
  }

  async isChecked(locator: PartLocator): Promise<boolean> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const checked = await this.page.locator(cssLocator).isChecked();
    return checked;
  }

  async isDisabled(locator: PartLocator): Promise<boolean> {
    const cssLocator = await locatorUtil.toCssSelector(locator, this);
    const isDisabled = await this.page.locator(cssLocator).isDisabled();
    return isDisabled;
  }

  async isReadonly(locator: PartLocator): Promise<boolean> {
    const readonly = await this.getAttribute(locator, 'readonly');
    return readonly != null;
  }

  async isVisible(locator: PartLocator): Promise<boolean> {
    const exists = await this.exists(locator);
    if (!exists) {
      return false;
    }

    async function checkCssVisibility(
      prop: CssProperty,
      invisibleValue: string,
      interactor: PlaywrightInteractor,
    ): Promise<boolean> {
      try {
        const value = await interactor.getStyleValue(locator, prop);
        return value !== invisibleValue;
      } catch (e) {
        // Element may disappear or detached while being checked because of animation
        // when it happens, an error is thrown.  In this case, if indeed the element
        // is not visible, we return false.  Otherwise, we re-throw the error.
        if ((await interactor.exists(locator)) === false) {
          return false;
        }
        throw e;
      }
    }

    if ((await checkCssVisibility('opacity', '0', this)) === false) {
      return false;
    }

    if ((await checkCssVisibility('visibility', 'hidden', this)) === false) {
      return false;
    }

    if ((await checkCssVisibility('display', 'none', this)) === false) {
      return false;
    }

    return true;
  }

  async hasCssClass(locator: PartLocator, className: string): Promise<boolean> {
    const classNames = await this.getAttribute(locator, 'class');
    if (classNames == null) {
      return false;
    }

    const names = classNames.split(/\s+/);
    return names.includes(className);
  }

  async hasAttribute(locator: PartLocator, name: string): Promise<boolean> {
    const attrValue = await this.getAttribute(locator, name);
    return attrValue != null;
  }

  clone(): Interactor {
    return new PlaywrightInteractor(this.page);
  }
}
