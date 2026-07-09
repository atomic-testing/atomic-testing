import {
  BlurOption,
  ClickOption,
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

  override async typeText(locator: PartLocator, text: string): Promise<void> {
    // typeText dispatches through `userEvent.keyboard` (DOMInteractor.typeText),
    // so it must go through runUserEvent — like enterText/click — or the
    // asyncWrapper's `IS_REACT_ACT_ENVIRONMENT=false` toggle resurfaces the
    // act-environment warnings runUserEvent exists to suppress.
    await this.runUserEvent(() => super.typeText(locator, text));
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
    // pressKey now dispatches through `userEvent.keyboard` whenever the target
    // holds focus (DOMInteractor.pressKey's editing-fidelity path), so it is
    // user-event-backed like typeText and must use runUserEvent for the same
    // reason. The non-focused fireEvent fallback is unaffected by the wrapper.
    await this.runUserEvent(() => super.pressKey(locator, key, option));
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
  // Waits poll DOM state that often only changes when a React commit flushes —
  // e.g. an exit transition's timer unmounting a dialog. Wrapping the WHOLE
  // wait in one `act()` starves those commits: the timer fires during the
  // wait, but its state update only flushes when the act unwinds, so every
  // probe reads stale DOM until the timeout. Wrapping each PROBE in `act()`
  // instead flushes pending work right before every read, so the wait
  // resolves as soon as the condition really holds.
  // (`waitUntilComponentState` needs no override: it polls through this
  // interactor's `waitUntil`.)
  override async waitUntil<T>(option: WaitUntilOption<T>): Promise<T> {
    return await super.waitUntil({
      ...option,
      probeFn: () => act(async () => await option.probeFn()),
    });
  }
  //#endregion
}
