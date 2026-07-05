import { createTestEngine } from '@atomic-testing/angular-21';
import { it } from 'vitest';

import { DialogExampleComponent } from '../src/examples/dialog/Dialog.examples';
import { MenuExampleComponent } from '../src/examples/menu/Menu.examples';
import { SelectExampleComponent } from '../src/examples/select/Select.examples';
import { SnackbarExampleComponent } from '../src/examples/snackbar/Snackbar.examples';

const lines: string[] = [];
function log(...args: unknown[]): void {
  lines.push(args.map(a => String(a)).join(' '));
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pressKey(el: HTMLElement, key: string, keyCode: number): void {
  const init = { key, keyCode, which: keyCode, bubbles: true } as KeyboardEventInit;
  el.dispatchEvent(new KeyboardEvent('keydown', init));
  el.dispatchEvent(new KeyboardEvent('keyup', init));
}

function describeHost(el: Element | null | undefined, label: string): void {
  if (el == null) {
    log(`[probe] ${label}: <none>`);
    return;
  }
  let hostChain = '';
  let cur: Element | null = el;
  for (let i = 0; i < 6 && cur; i++) {
    hostChain += ` << ${cur.tagName.toLowerCase()}.${cur.className.toString().split(' ').slice(0, 3).join('.')}[popover=${cur.getAttribute('popover')}]`;
    cur = cur.parentElement;
  }
  log(`[probe] ${label}: inOverlayContainer=${!!el.closest('.cdk-overlay-container')} inFormField=${!!el.closest('mat-form-field')} chain:${hostChain}`);
}

it('probe select popover mode', async () => {
  const engine = await createTestEngine(SelectExampleComponent, {});
  const host = document.querySelector('[data-testid="fruit-select"]') as HTMLElement;
  host.focus();
  pressKey(host, 'Enter', 13);
  await sleep(300);
  log('[probe] select aria-expanded:', host.getAttribute('aria-expanded'), 'aria-controls:', host.getAttribute('aria-controls'));
  const panel = document.querySelector('[role="listbox"]');
  describeHost(panel, 'select panel');
  log('[probe] select panel matches top layer:', panel ? String((panel.closest('[popover]') as HTMLElement | null)?.matches(':popover-open')) : 'n/a');
  log('[probe] host text while open:', JSON.stringify((host.textContent ?? '').trim()));
  const panelId = host.getAttribute('aria-controls');
  const opts = document.querySelectorAll(`[id="${panelId}"] [role="option"]`);
  log('[probe] options via link:', opts.length);
  (opts[0] as HTMLElement).click();
  await sleep(300);
  log('[probe] after option click expanded:', host.getAttribute('aria-expanded'), 'host text:', JSON.stringify((host.textContent ?? '').trim()));
  await engine.cleanUp();
});

it('probe dialog popover mode', async () => {
  const engine = await createTestEngine(DialogExampleComponent, {});
  (document.querySelector('[data-testid="dialog-open-trigger"]') as HTMLElement).click();
  await sleep(400);
  const dialog = document.querySelector('[role="dialog"]');
  describeHost(dialog, 'dialog container');
  log('[probe] dialog id/aria-labelledby:', dialog?.getAttribute('id'), dialog?.getAttribute('aria-labelledby'));
  const backdrop = document.querySelector('.cdk-overlay-backdrop');
  describeHost(backdrop, 'dialog backdrop');
  pressKey(dialog as HTMLElement, 'Escape', 27);
  await sleep(400);
  log('[probe] dialog exists after Escape:', !!document.querySelector('[role="dialog"]'), 'result:', document.querySelector('[data-testid="dialog-result"]')?.textContent);
  (document.querySelector('[data-testid="dialog-open-trigger"]') as HTMLElement).click();
  await sleep(400);
  (document.querySelector('.cdk-overlay-backdrop') as HTMLElement)?.click();
  await sleep(400);
  log('[probe] dialog exists after backdrop click:', !!document.querySelector('[role="dialog"]'));
  await engine.cleanUp();
});

it('probe menu popover mode', async () => {
  const engine = await createTestEngine(MenuExampleComponent, {});
  (document.querySelector('[data-testid="account-menu-trigger"]') as HTMLElement).click();
  await sleep(300);
  const menu = document.querySelector('[role="menu"]');
  describeHost(menu, 'menu panel');
  log('[probe] menu aria-label:', menu?.getAttribute('aria-label'), 'items:', document.querySelectorAll('[role="menuitem"]').length);
  await engine.cleanUp();
});

it('probe snackbar popover mode', async () => {
  const engine = await createTestEngine(SnackbarExampleComponent, {});
  (document.querySelector('[data-testid="snackbar-open-trigger"]') as HTMLElement).click();
  await sleep(400);
  const container = document.querySelector('mat-snack-bar-container');
  describeHost(container, 'snackbar container');
  log('[probe] label:', document.querySelector('[matSnackBarLabel]')?.textContent?.trim(), 'action:', document.querySelector('[matSnackBarAction]')?.textContent?.trim());
  log('[probe] aria-live:', document.querySelector('mat-snack-bar-container [aria-live]')?.getAttribute('aria-live'));
  await engine.cleanUp();
});

it('zz report', () => {
  throw new Error('PROBE REPORT\n' + lines.join('\n'));
});
