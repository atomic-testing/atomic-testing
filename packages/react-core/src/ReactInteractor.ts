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
import { act } from '@testing-library/react';

export class ReactInteractor extends DOMInteractor {
  /**
   * Run a `user-event`-backed interaction inside `act` while holding the
   * `IS_REACT_ACT_ENVIRONMENT` global at `true` for its whole duration.
   *
   * `@testing-library/react`'s `asyncWrapper` (installed into
   * `@testing-library/dom`'s config, which `user-event` consults) temporarily
   * sets `IS_REACT_ACT_ENVIRONMENT` to `false` around every async `user-event`
   * API call — its contract assumes `user-event` is NOT already running inside
   * `act`. This interactor deliberately nests the whole interaction in `act`,
   * so during that window react-dom sees "act queue active, but the act
   * environment global is false" and logs `The current testing environment is
   * not configured to support act(...)` for every update scheduled by event
   * handlers, focus callbacks, or timers. Update-heavy trees (e.g. Radix
   * primitives) emit thousands of these — enough log volume that CI jest runs
   * were killed mid-run (the "Test Radix components" CI outage of 2026-07-04,
   * introduced when #1014 unified the React module graph and made the outer
   * act queue visible to the components' react-dom).
   *
   * Pinning the global to `true` here is truthful, not suppression: every
   * update in this window IS covered by the surrounding `act`. The original
   * property state is restored before the method resolves.
   */
  private async runUserEvent(interaction: () => Promise<void>): Promise<void> {
    const g = globalThis as { IS_REACT_ACT_ENVIRONMENT?: unknown };
    const originalDescriptor = Object.getOwnPropertyDescriptor(g, 'IS_REACT_ACT_ENVIRONMENT');
    Object.defineProperty(g, 'IS_REACT_ACT_ENVIRONMENT', {
      configurable: true,
      get: () => true,
      set: () => {
        // Swallow @testing-library/react asyncWrapper's temporary `false`
      },
    });
    try {
      await act(async () => {
        await interaction();
      });
    } finally {
      if (originalDescriptor != null) {
        Object.defineProperty(g, 'IS_REACT_ACT_ENVIRONMENT', originalDescriptor);
      } else {
        delete g.IS_REACT_ACT_ENVIRONMENT;
      }
    }
  }

  override async enterText(locator: PartLocator, text: string, option?: Partial<EnterTextOption>): Promise<void> {
    await this.runUserEvent(() => super.enterText(locator, text, option));
  }

  override async setRangeValue(locator: PartLocator, value: number): Promise<void> {
    await act(async () => {
      await super.setRangeValue(locator, value);
    });
  }

  override async click(locator: PartLocator, option?: Partial<ClickOption>): Promise<void> {
    await this.runUserEvent(() => super.click(locator, option));
  }

  override async hover(locator: PartLocator, option?: Partial<HoverOption>): Promise<void> {
    await this.runUserEvent(() => super.hover(locator, option));
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
    await this.runUserEvent(() => super.activate(locator));
  }

  override async selectOptionValue(locator: PartLocator, values: string[]): Promise<void> {
    await this.runUserEvent(() => super.selectOptionValue(locator, values));
  }

  override async setInputFiles(locator: PartLocator, files: string | string[]): Promise<void> {
    await this.runUserEvent(() => super.setInputFiles(locator, files));
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
    return await act(async () => {
      return await super.waitUntil(option);
    });
  }
  //#endregion
}
