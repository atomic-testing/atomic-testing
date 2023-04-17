import { Interactor } from '../interactor';
import { CssLocator, LocatorChain, LocatorRelativePosition, LocatorType } from '../locators';
import { IComponentDriverOption } from '../partTypes';
import { append } from '../utils/locatorUtil';
import { ComponentDriver } from './ComponentDriver';

type ComponentDriverClass<T extends ComponentDriver> = new (
  locator: LocatorChain,
  interactor: Interactor,
  option?: Partial<IComponentDriverOption<any>>,
) => T;

export async function getListItemByIndex<T extends ComponentDriver>(
  host: ComponentDriver<any>,
  itemLocatorBase: LocatorChain,
  index: number,
  driverClass: ComponentDriverClass<T>,
): Promise<T | null> {
  const nthLocator: CssLocator = {
    type: LocatorType.Css,
    selector: `:nth-of-type(${index + 1})`,
    relative: LocatorRelativePosition.Same,
  };
  const itemLocator = append(host.locator, itemLocatorBase, nthLocator);
  const exists = await host.interactor.exists(itemLocator);
  if (exists) {
    return new driverClass(itemLocator, host.interactor, host.commutableOption);
  }
  return null;
}
