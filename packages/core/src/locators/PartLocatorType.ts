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

export enum LocatorType {
  Css = 'css',
  Xpath = 'xpath',
}

export type CssLocator = {
  type: LocatorType.Css;
  selector: string;
  relative?: LocatorRelativePosition;
};

export type PartLocatorType = string | CssLocator;
