import { byDataTestId, findByRole, locatorUtil } from '@atomic-testing/core';

import { DOMInteractor } from '../src/DOMInteractor';

/**
 * Regression guard (PR #1153 review): an unscoped `findByRole(...)` — no
 * preceding locator segment — must resolve within the interactor's own
 * `rootEl`, exactly like every CSS locator already does. It must NOT escape
 * to the document root, which would silently reach outside an intentionally
 * scoped interactor (e.g. a Storybook canvas).
 */
describe('DOMInteractor findByRole scoping', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('resolves an unscoped findByRole() within rootEl, not the whole document', async () => {
    document.body.innerHTML = `
      <button type="button">Outside Save</button>
      <div data-testid="scoped-root">
        <button type="button">Inside Save</button>
      </div>
    `;
    const scopedRoot = document.querySelector<HTMLElement>('[data-testid="scoped-root"]')!;
    const interactor = new DOMInteractor(scopedRoot);

    const found = await interactor.getElement(findByRole('button', 'Inside Save'));
    expect(found?.textContent).toBe('Inside Save');

    // The document has TWO elements named "Save" via a shared substring in
    // this fixture's naming — assert the outside one is unreachable from the
    // scoped interactor, proving the search did not escape to the document.
    const outsideOnly = await interactor.getElement(findByRole('button', 'Outside Save'));
    expect(outsideOnly).toBeUndefined();
  });

  it("still escapes to the document root when relative is 'Root'", async () => {
    document.body.innerHTML = `
      <button type="button">Outside Save</button>
      <div data-testid="scoped-root">
        <button type="button">Inside Save</button>
      </div>
    `;
    const scopedRoot = document.querySelector<HTMLElement>('[data-testid="scoped-root"]')!;
    const interactor = new DOMInteractor(scopedRoot);

    // A 'Root' locator explicitly opts back into document-root scope, so the
    // element OUTSIDE the interactor's own rootEl is reachable here.
    const found = await interactor.getElement(findByRole('button', 'Outside Save', 'Root'));
    expect(found?.textContent).toBe('Outside Save');
  });

  it('scopes findByRole appended after a CSS locator to that ancestor, unaffected by this fix', async () => {
    document.body.innerHTML = `
      <div data-testid="panel-a"><button type="button">Confirm</button></div>
      <div data-testid="panel-b"><button type="button">Confirm</button></div>
    `;
    const interactor = new DOMInteractor(document.body);

    const inPanelB = await interactor.getElement(
      locatorUtil.append(byDataTestId('panel-b'), findByRole('button', 'Confirm'))
    );
    expect(inPanelB?.closest('[data-testid]')?.getAttribute('data-testid')).toBe('panel-b');
  });
});
