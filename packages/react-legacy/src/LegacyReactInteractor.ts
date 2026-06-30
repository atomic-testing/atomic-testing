import {
  BlurOption,
  ClickOption,
  defaultWaitForOption,
  EnterTextOption,
  FocusOption,
  HoverOption,
  MouseDownOption,
  MouseEnterOption,
  MouseLeaveOption,
  MouseMoveOption,
  MouseOutOption,
  MouseUpOption,
  PartLocator,
  Point,
  PressKeyOption,
  WaitForOption,
  WaitUntilOption,
} from '@atomic-testing/core';
import { DOMInteractor } from '@atomic-testing/dom-core';
import { act } from 'react-dom/test-utils';

/**
 * React 16/17 counterpart of `@atomic-testing/react-core`'s `ReactInteractor`.
 *
 * It is a deliberate parallel implementation rather than a subclass of the
 * react-core interactor: react-core wraps actions with `act` from
 * `@testing-library/react@16`, whose peer range is React 18/19. Reusing it would
 * drag that dependency into react-legacy and make the package impossible to
 * install on React 16/17 (the very versions this adapter exists to support). By
 * extending `DOMInteractor` directly and wrapping with `act` from
 * `react-dom/test-utils` (the React ≤17 act), react-legacy stays on a coherent
 * React-16/17 dependency graph.
 */
export class LegacyReactInteractor extends DOMInteractor {
  override async enterText(locator: PartLocator, text: string, option?: Partial<EnterTextOption>): Promise<void> {
    await act(async () => {
      await super.enterText(locator, text, option);
    });
  }

  override async setRangeValue(locator: PartLocator, value: number): Promise<void> {
    await act(async () => {
      await super.setRangeValue(locator, value);
    });
  }

  override async click(locator: PartLocator, option?: Partial<ClickOption>): Promise<void> {
    await act(async () => {
      await super.click(locator, option);
    });
  }

  override async hover(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    await act(async () => {
      await super.hover(locator, option);
    });
  }

  override async mouseMove(locator: PartLocator, option?: Partial<MouseMoveOption>): Promise<void> {
    await act(async () => {
      await super.mouseMove(locator, option);
    });
  }

  override async mouseDown(locator: PartLocator, option?: Partial<MouseDownOption>): Promise<void> {
    await act(async () => {
      await super.mouseDown(locator, option);
    });
  }

  override async mouseUp(locator: PartLocator, option?: Partial<MouseUpOption>): Promise<void> {
    await act(async () => {
      await super.mouseUp(locator, option);
    });
  }

  override async mouseOver(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    await act(async () => {
      await super.mouseOver(locator, option);
    });
  }

  override async mouseOut(locator: PartLocator, option?: Partial<MouseOutOption>): Promise<void> {
    await act(async () => {
      await super.mouseOut(locator, option);
    });
  }

  override async mouseEnter(locator: PartLocator, option?: Partial<MouseEnterOption>): Promise<void> {
    await act(async () => {
      await super.mouseEnter(locator, option);
    });
  }

  override async mouseLeave(locator: PartLocator, option?: Partial<MouseLeaveOption>): Promise<void> {
    await act(async () => {
      await super.mouseLeave(locator, option);
    });
  }

  override async focus(locator: PartLocator, option?: Partial<FocusOption>): Promise<void> {
    await act(async () => {
      await super.focus(locator, option);
    });
  }

  override async blur(locator: PartLocator, option?: Partial<BlurOption>): Promise<void> {
    await act(async () => {
      await super.blur(locator, option);
    });
  }

  override async pressKey(locator: PartLocator, key: string, option?: Partial<PressKeyOption>): Promise<void> {
    await act(async () => {
      await super.pressKey(locator, key, option);
    });
  }

  override async contextMenu(locator: PartLocator): Promise<void> {
    await act(async () => {
      await super.contextMenu(locator);
    });
  }

  override async activate(locator: PartLocator): Promise<void> {
    await act(async () => {
      await super.activate(locator);
    });
  }

  override async selectOptionValue(locator: PartLocator, values: string[]): Promise<void> {
    await act(async () => {
      await super.selectOptionValue(locator, values);
    });
  }

  override async setInputFiles(locator: PartLocator, files: string | string[]): Promise<void> {
    await act(async () => {
      await super.setInputFiles(locator, files);
    });
  }

  override async scrollIntoView(locator: PartLocator): Promise<void> {
    await act(async () => {
      await super.scrollIntoView(locator);
    });
  }

  override async scrollBy(locator: PartLocator, delta: Point): Promise<void> {
    await act(async () => {
      await super.scrollBy(locator, delta);
    });
  }

  override async dragTo(source: PartLocator, target: PartLocator): Promise<void> {
    await act(async () => {
      await super.dragTo(source, target);
    });
  }

  override async drag(locator: PartLocator, delta: Point): Promise<void> {
    await act(async () => {
      await super.drag(locator, delta);
    });
  }

  //#region wait condition
  override async waitUntilComponentState(
    locator: PartLocator,
    option: Partial<Readonly<WaitForOption>> = defaultWaitForOption
  ): Promise<void> {
    await act(async () => {
      await super.waitUntilComponentState(locator, option);
    });
  }

  override async waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
    // The React ≤17 `act` async overload resolves to `undefined`, not the
    // callback's value (unlike React 18's act), so capture the result via a
    // closure instead of returning it through `act`.
    let result!: T;
    await act(async () => {
      result = await super.waitUntil(option);
    });
    return result;
  }
  //#endregion
}
