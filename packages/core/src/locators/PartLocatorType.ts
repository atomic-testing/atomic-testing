import { CssLocatorSource } from './CssLocatorSource';

export enum LocatorRelativePosition {
  Root = 'Root',

  /**
   * Descendent of the base element
   */
  Descendent = 'Descendent',

  /**
   * Locator would be within the same element(s), used for finding
   * elements' by state or value
   */
  Same = 'Same',
}

export type LocatorType = 'css' | 'xpath';

export const LocatorTypeLookup: Record<string, LocatorType> = Object.freeze({
  Css: 'css',
  Xpath: 'xpath',
});

export class CssLocator {
  type: LocatorType = 'css';
  relative: LocatorRelativePosition = LocatorRelativePosition.Descendent;
  source?: CssLocatorSource;

  constructor(public readonly selector: string) {}
}

export type PartLocatorType = CssLocator;
