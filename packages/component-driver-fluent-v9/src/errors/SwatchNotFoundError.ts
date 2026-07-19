import { ComponentDriver, ItemNotFoundError } from '@atomic-testing/core';

export const SwatchNotFoundErrorId = 'SwatchNotFoundError';

/**
 * Thrown by {@link SwatchPickerDriver.selectByIndex}/`selectByColor` when no
 * child swatch matches the given query (an out-of-range index, or a color no
 * swatch renders).
 */
export class SwatchNotFoundError extends ItemNotFoundError {
  constructor(
    public readonly query: string,
    driver: ComponentDriver<any>
  ) {
    super(query, driver, `Cannot find swatch: ${query}`);
    this.name = SwatchNotFoundErrorId;
  }
}
