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
