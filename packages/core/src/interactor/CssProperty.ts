/**
 * Supported CSS Properties
 */
export type CssProperty = Exclude<
  keyof CSSStyleDeclaration,
  ['parentRule', 'length', 'getPropertyPriority', 'getPropertyValue', 'item', 'removeProperty', 'setProperty']
>;
