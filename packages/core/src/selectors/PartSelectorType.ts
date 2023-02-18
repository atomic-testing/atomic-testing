export enum SelectorRelativePosition {
  documentRoot = 'documentRoot',
  baseElement = 'baseElement',
}

export enum SelectorType {
  css = 'css',
  xpath = 'xpath',
}

export type CssSelector = {
  type: SelectorType.css;
  selector: string;
  relative?: SelectorRelativePosition;
};

export type PartSelectorType = string | CssSelector;
