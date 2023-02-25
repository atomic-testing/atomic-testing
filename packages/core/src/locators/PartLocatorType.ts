export enum LocatorRelativePosition {
  documentRoot = 'documentRoot',
  baseElement = 'baseElement',
}

export enum LocatorType {
  css = 'css',
  xpath = 'xpath',
}

export type CssLocator = {
  type: LocatorType.css;
  selector: string;
  relative?: LocatorRelativePosition;
};

export type PartLocatorType = string | CssLocator;
