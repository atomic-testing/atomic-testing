/**
 * @jest-environment jsdom
 */
import {
  isElementChecked,
  isElementDisabled,
  isElementInError,
  isElementReadonly,
  isElementRequired,
} from '../elementStateUtil';

function render(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body;
}

function target(testId: string): Element {
  const el = document.querySelector(`[data-testid="${testId}"]`);
  if (el == null) {
    throw new Error(`fixture has no [data-testid="${testId}"]`);
  }
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('isElementChecked', () => {
  it('reads the live checked property of a native checkbox', () => {
    render('<input type="checkbox" data-testid="box" />');
    const box = target('box') as HTMLInputElement;

    expect(isElementChecked(box)).toBe(false);
    box.checked = true;
    expect(isElementChecked(box)).toBe(true);
  });

  it('reads the live checked property of a native radio', () => {
    render('<input type="radio" data-testid="radio" checked />');

    expect(isElementChecked(target('radio'))).toBe(true);
  });

  it('lets the native signal win over a contradicting aria-checked', () => {
    render('<input type="checkbox" data-testid="box" aria-checked="true" />');

    expect(isElementChecked(target('box'))).toBe(false);
  });

  it('falls back to aria-checked for a custom widget', () => {
    render('<div role="checkbox" aria-checked="true" data-testid="custom">x</div>');

    expect(isElementChecked(target('custom'))).toBe(true);
  });

  it('treats aria-checked="mixed" as not checked', () => {
    render('<div role="checkbox" aria-checked="mixed" data-testid="tri">x</div>');

    expect(isElementChecked(target('tri'))).toBe(false);
  });

  // The divergence this policy closes: Playwright answered this with a
  // `Not a checkbox or radio button` throw while jsdom answered false.
  it('answers false — never throws — for an element with no checkable semantics', () => {
    render('<div data-testid="plain">x</div><input type="text" data-testid="text" />');

    expect(isElementChecked(target('plain'))).toBe(false);
    expect(isElementChecked(target('text'))).toBe(false);
  });
});

describe('isElementDisabled', () => {
  it('reads a form control own disabled attribute', () => {
    render('<button disabled data-testid="btn">x</button><button data-testid="on">x</button>');

    expect(isElementDisabled(target('btn'))).toBe(true);
    expect(isElementDisabled(target('on'))).toBe(false);
  });

  // The divergence this policy closes: the `disabled` IDL property mirrors only
  // the element's OWN attribute, so jsdom reported this input as enabled.
  it('inherits disabled from an ancestor fieldset', () => {
    render('<fieldset disabled><input type="text" data-testid="inner" /></fieldset>');

    expect(isElementDisabled(target('inner'))).toBe(true);
  });

  it("exempts controls inside the disabled fieldset's first legend", () => {
    render(
      '<fieldset disabled><legend><input type="text" data-testid="in-legend" /></legend>' +
        '<input type="text" data-testid="in-body" /></fieldset>'
    );

    expect(isElementDisabled(target('in-legend'))).toBe(false);
    expect(isElementDisabled(target('in-body'))).toBe(true);
  });

  it('disables an option inside a disabled optgroup', () => {
    render('<select><optgroup disabled><option data-testid="opt">A</option></optgroup></select>');

    expect(isElementDisabled(target('opt'))).toBe(true);
  });

  it('honors aria-disabled on the element itself', () => {
    render('<div role="button" aria-disabled="true" data-testid="aria">x</div>');

    expect(isElementDisabled(target('aria'))).toBe(true);
  });

  it('inherits aria-disabled from an ancestor composite', () => {
    render('<div role="toolbar" aria-disabled="true"><button data-testid="item">x</button></div>');

    expect(isElementDisabled(target('item'))).toBe(true);
  });

  it('lets a nearer aria-disabled="false" re-enable a descendant', () => {
    render('<div aria-disabled="true"><div aria-disabled="false"><button data-testid="item">x</button></div></div>');

    expect(isElementDisabled(target('item'))).toBe(false);
  });

  it('ignores a stray disabled attribute on a non-form-control', () => {
    render('<div disabled data-testid="div">x</div>');

    expect(isElementDisabled(target('div'))).toBe(false);
  });

  it('reports a disabled fieldset itself as disabled', () => {
    render('<fieldset disabled data-testid="fs"><input /></fieldset>');

    expect(isElementDisabled(target('fs'))).toBe(true);
  });
});

describe('isElementReadonly', () => {
  it('reads the native readonly attribute', () => {
    render('<input type="text" readonly data-testid="ro" /><input type="text" data-testid="rw" />');

    expect(isElementReadonly(target('ro'))).toBe(true);
    expect(isElementReadonly(target('rw'))).toBe(false);
  });

  it('reads aria-readonly for a custom widget', () => {
    render('<div role="textbox" aria-readonly="true" data-testid="aria">x</div>');

    expect(isElementReadonly(target('aria'))).toBe(true);
  });
});

describe('isElementRequired', () => {
  it('reads the native required property', () => {
    render('<input type="text" required data-testid="req" /><input type="text" data-testid="opt" />');

    expect(isElementRequired(target('req'))).toBe(true);
    expect(isElementRequired(target('opt'))).toBe(false);
  });

  it('reads aria-required for a custom widget', () => {
    render('<div role="textbox" aria-required="true" data-testid="aria">x</div>');

    expect(isElementRequired(target('aria'))).toBe(true);
  });

  // Reading the required ATTRIBUTE (PlaywrightInteractor's previous behavior)
  // made this true there and false in jsdom.
  it('ignores a stray required attribute on an element with no such concept', () => {
    render('<div required data-testid="div">x</div>');

    expect(isElementRequired(target('div'))).toBe(false);
  });
});

describe('isElementInError', () => {
  it('reads aria-invalid', () => {
    render('<input data-testid="bad" aria-invalid="true" /><input data-testid="ok" aria-invalid="false" />');

    expect(isElementInError(target('bad'))).toBe(true);
    expect(isElementInError(target('ok'))).toBe(false);
  });
});

// The predicates are stringified into the browser by PlaywrightInteractor, so a
// reference to anything outside the function body would resolve to `undefined`
// there and silently change the answer — the exact drift this module exists to
// prevent. Guarding structurally keeps the constraint from being violated by a
// well-meaning refactor that extracts a shared local helper.
describe('page-serializable contract', () => {
  const predicates = [
    ['isElementChecked', isElementChecked],
    ['isElementDisabled', isElementDisabled],
    ['isElementReadonly', isElementReadonly],
    ['isElementRequired', isElementRequired],
    ['isElementInError', isElementInError],
  ] as const;

  it.each(predicates)('%s is declared as a plain, self-contained function', (_name, predicate) => {
    const source = predicate.toString();
    expect(source.startsWith('function')).toBe(true);
    expect(source).not.toMatch(/\brequire\(/);
  });
});
