import { byCssSelector, ComponentDriver, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

export interface StepInfo {
  /** The step's visible label. */
  label: Optional<string>;
  /** Whether this is the active step (MUI marks the label `Mui-active`). */
  active: boolean;
  /** Whether the step has been completed (`Mui-completed`). */
  completed: boolean;
  /** Whether the step is disabled (`Mui-disabled`). */
  disabled: boolean;
}

// The `.MuiStepLabel-label` span carries both the clean label text and the
// per-step state class, making it the single source of truth for step state.
const stepLabelLocator = byCssSelector('.MuiStepLabel-label');

/**
 * Locator for the label of the step at `index`. MUI renders steps and connectors
 * as alternating `<div>` children (step, connector, step, …), so the step at
 * `index` is the `2*index+1`-th element of its type; nth-of-type addresses it
 * without the connectors shifting positions.
 *
 * The `2*index+1` stride encodes this interleaved-connector layout and is a
 * per-MUI-version invariant: v9 renders the connector inside each step (stride
 * `index+1`), so a MUI major bump must re-verify it.
 */
function stepLabelAt(index: number): PartLocator {
  return byCssSelector(`.MuiStep-root:nth-of-type(${2 * index + 1}) .MuiStepLabel-label`);
}

function stepButtonAt(index: number): PartLocator {
  return byCssSelector(`.MuiStep-root:nth-of-type(${2 * index + 1}) .MuiStepButton-root`);
}

/**
 * Driver for the Material UI v7 Stepper component.
 *
 * Each step's state lives on its `.MuiStepLabel-label` (`Mui-active`,
 * `Mui-completed`, `Mui-disabled`); reading every label's class in one pass gives
 * the step states and count in document order. Steps are addressed positionally
 * for label text and clicks via {@link stepLabelAt}/{@link stepButtonAt}.
 *
 * Supported layouts: the default horizontal stepper and the vertical orientation,
 * where MUI interleaves a connector `<div>` between every pair of step `<div>`s
 * (so steps occupy odd nth-of-type positions) and every step renders a text label.
 * Layouts that break that assumption are not supported: `alternativeLabel` and
 * `connector={null}` emit consecutive step elements (no interleaved connectors),
 * and icon-only steps render no `.MuiStepLabel-label`; under those the positional
 * addressing and the document-order class list desynchronize. Robustly supporting
 * them needs an interactor primitive to address the n-th of non-sibling matches
 * (CSS `:nth-child(of S)` is unsupported in jsdom), which is out of this driver's scope.
 * @see https://mui.com/material-ui/react-stepper/
 */
export class StepperDriver extends ComponentDriver {
  private async getStepClassList(): Promise<readonly string[]> {
    return this.interactor.getAttribute(locatorUtil.append(this.locator, stepLabelLocator), 'class', true);
  }

  /**
   * The number of steps.
   */
  async getStepCount(): Promise<number> {
    return (await this.getStepClassList()).length;
  }

  /**
   * Zero-based index of the active step, or `-1` when none is active.
   */
  async getActiveStepIndex(): Promise<number> {
    const classes = await this.getStepClassList();
    return classes.findIndex(c => c.split(/\s+/).includes('Mui-active'));
  }

  /**
   * Every step with its label and active/completed/disabled state, in order.
   */
  async getSteps(): Promise<StepInfo[]> {
    const classes = await this.getStepClassList();
    const steps: StepInfo[] = [];
    for (let index = 0; index < classes.length; index++) {
      const stateClasses = classes[index].split(/\s+/);
      const label = await this.interactor.getText(locatorUtil.append(this.locator, stepLabelAt(index)));
      steps.push({
        label: label?.trim(),
        active: stateClasses.includes('Mui-active'),
        completed: stateClasses.includes('Mui-completed'),
        disabled: stateClasses.includes('Mui-disabled'),
      });
    }
    return steps;
  }

  /**
   * Navigate to the step at `index` by clicking its control (requires a clickable
   * `StepButton`, e.g. a non-linear stepper).
   * @returns `false` when the step is out of range, has no button, or is disabled.
   */
  async goToStep(index: number): Promise<boolean> {
    if (index < 0 || index >= (await this.getStepCount())) {
      return false;
    }
    const button = locatorUtil.append(this.locator, stepButtonAt(index));
    if (!(await this.interactor.exists(button)) || (await this.interactor.isDisabled(button))) {
      return false;
    }
    await this.interactor.click(button);
    return true;
  }

  override get driverName(): string {
    return 'MuiV6StepperDriver';
  }
}
