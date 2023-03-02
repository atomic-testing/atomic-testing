import userEvent from '@testing-library/user-event';
import { IClickOption, IInteractor, LocatorChain, locatorUtil, Optional } from '@testzilla/core';

export class CypressInteractor implements IInteractor {
  constructor() {}

  async click(locator: LocatorChain, option?: IClickOption): Promise<void> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    cy.get(cssLocator).click({ force: true });
    return Promise.resolve();
  }

  async getAttribute(locator: LocatorChain): Promise<Optional<string>> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    return new Cypress.Promise((resolve) => {
      cy.get(cssLocator).then(($el) => {
        resolve($el.attr('value'));
      });
    });
  }

  async getText(locator: LocatorChain): Promise<Optional<string>> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    return new Cypress.Promise((resolve) => {
      cy.get(cssLocator).then(($el) => {
        resolve($el.text());
      });
    });
  }

  exists(locator: LocatorChain): Promise<boolean> {
    const cssLocator = locatorUtil.toCssSelector(locator);
    cy.get(cssLocator).should('exist');
    return Promise.resolve(true);
  }

  clone(): IInteractor {
    return new CypressInteractor();
  }
}
