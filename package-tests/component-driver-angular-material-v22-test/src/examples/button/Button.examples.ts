import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';

/**
 * Smoke example for the MatButton driver: a wired button recording its click
 * count, and a disabled button. The `matButton` directive attaches to the
 * native `<button>` host element, so `data-testid` stays on the element the
 * driver interacts with.
 */
@Component({
  selector: 'atomic-button-example',
  imports: [MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <button matButton="filled" data-testid="save-button" (click)="save()">Save</button>
      <output data-testid="click-count">{{ clickCount() }}</output>
      <button matButton data-testid="disabled-button" disabled>Disabled</button>
    </section>
  `,
})
export class ButtonExampleComponent {
  readonly clickCount = signal(0);

  save(): void {
    this.clickCount.update(value => value + 1);
  }
}
