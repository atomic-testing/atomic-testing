import { byCssClass, ComponentDriver, locatorUtil } from '@atomic-testing/core';

/**
 * Driver for the Material UI v6 Progress components (`LinearProgress` / `CircularProgress`).
 *
 * A progress indicator is a read-only, non-interactive status component: it has no
 * user-settable value and renders no form controls. The driver therefore only reads
 * state (`getValue` from `aria-valuenow`, `getType`, `isDeterminate`, `getBufferValue`) and
 * deliberately does NOT implement `IInputDriver` — an earlier version mistakenly modelled it
 * on a radio-group input, exposing a nonsensical `setValue`.
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

  /**
   * The buffer value of a `variant="buffer"` LinearProgress, or `null` when there is no
   * buffer bar. MUI has no `aria-` attribute for the buffer, so it is derived from the
   * second bar's `transform: translateX(-N%)` (buffer = 100 − N).
   */
  async getBufferValue(): Promise<number | null> {
    const bufferBar = locatorUtil.append(this.locator, byCssClass('MuiLinearProgress-bar2Buffer'));
    if (!(await this.interactor.exists(bufferBar))) {
      return null;
    }
    const style = await this.interactor.getAttribute(bufferBar, 'style');
    const match = style?.match(/translateX\(\s*(-?[\d.]+)%\)/);
    if (match == null) {
      return null;
    }
    return 100 + parseFloat(match[1]!);
  }

  get driverName(): string {
    return 'MuiV6ProgressDriver';
  }
}
