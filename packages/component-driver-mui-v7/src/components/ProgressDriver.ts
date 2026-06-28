import { ComponentDriver } from '@atomic-testing/core';

/**
 * Driver for the Material UI v7 Progress components (`LinearProgress` / `CircularProgress`).
 *
 * A progress indicator is a read-only, non-interactive status component: it has no
 * user-settable value and renders no form controls. The driver therefore only reads
 * state (`getValue` from `aria-valuenow`, `getType`, `isDeterminate`) and deliberately
 * does NOT implement `IInputDriver` — an earlier version mistakenly modelled it on a
 * radio-group input, exposing a nonsensical `setValue`.
 *
 * @see https://mui.com/material-ui/react-progress/
 */
export class ProgressDriver extends ComponentDriver {
  async getValue(): Promise<number | null> {
    const rawValue = await this.getAttribute('aria-valuenow');
    const numValue = Number(rawValue);
    if (rawValue == null || isNaN(numValue)) {
      return null;
    }
    return numValue;
  }

  async getType(): Promise<'linear' | 'circular'> {
    const cssClasses = await this.getAttribute('class');
    if (cssClasses?.includes('MuiCircularProgress-root')) {
      return 'circular';
    }
    return 'linear';
  }

  async isDeterminate(): Promise<boolean> {
    const val = await this.getValue();
    return val != null;
  }

  // The buffer value of variant="buffer" (derivable from the bar2 transform,
  // e.g. style="transform: translateX(-15%)" → 85) is not yet exposed; tracked
  // as getBufferValue in the state-accessor work (#872).

  get driverName(): string {
    return 'MuiV7ProgressDriver';
  }
}
