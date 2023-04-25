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
  readonly after?: readonly CssLocator[];

  constructor(public readonly selector: string, after?: readonly CssLocator[]) {
    if (this.after && after) {
      this.after = this.after.concat(after);
    } else if (after) {
      this.after = after;
    }
  }

  append(...after: readonly CssLocator[]): CssLocator {
    let fullAfter = this.after ?? [];
    fullAfter = fullAfter.concat(after);
    const result = new CssLocator(this.selector, fullAfter);
    result.source = this.source;
    result.relative = this.relative;
    return result;
  }

  clone(): CssLocator {
    const result = new CssLocator(this.selector, this.after);
    result.source = this.source;
    result.relative = this.relative;
    return result;
  }
}

export type PartLocatorType = CssLocator;
