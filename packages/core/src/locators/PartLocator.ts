import { CssLocator } from './CssLocator';

export type CssLocatorChain = CssLocator[];
export type PartLocator = CssLocator | CssLocatorChain;

/**
 * @deprecated LocatorChain is deprecated, please use PartLocator instead
 */
export type LocatorChain = PartLocator;
