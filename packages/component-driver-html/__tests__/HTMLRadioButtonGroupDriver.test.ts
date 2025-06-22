import { CssLocator } from '@atomic-testing/core';
import { HTMLRadioButtonGroupDriver } from '../src/components/HTMLRadioButtonGroupDriver';

describe('HTMLRadioButtonGroupDriver', () => {
  test('should expose correct driverName', () => {
    const driver = new HTMLRadioButtonGroupDriver(new CssLocator('input[type="radio"]'), {} as any);
    expect(driver.driverName).toBe('HTMLRadioButtonGroupDriver');
  });
});
