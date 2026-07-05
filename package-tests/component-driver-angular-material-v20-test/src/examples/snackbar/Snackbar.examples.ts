import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Example for the MatSnackBar driver: one trigger opens a persistent snackbar
 * with an Undo action (its activation is echoed into an `<output>`), another
 * opens a short-lived snackbar whose auto-dismiss the suite observes with
 * `waitUntil` rather than sleeps. The snackbar renders in the CDK overlay
 * container as a `<mat-snack-bar-container>` with an `aria-live` region — no
 * `data-testid` can be forwarded, so the driver anchors on that element.
 */
@Component({
  selector: 'atomic-snackbar-example',
  imports: [MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <button matButton data-testid="snackbar-open-trigger" (click)="openSnackbar()">Archive note</button>
      <button matButton data-testid="timed-snackbar-open-trigger" (click)="openTimedSnackbar()">Timed note</button>
      <output data-testid="snackbar-action-result">{{ actionResult() }}</output>
    </section>
  `,
})
export class SnackbarExampleComponent {
  private readonly snackBar = inject(MatSnackBar);
  readonly actionResult = signal('');

  openSnackbar(): void {
    const ref = this.snackBar.open('Note archived', 'Undo');
    ref.onAction().subscribe(() => this.actionResult.set('undone'));
  }

  openTimedSnackbar(): void {
    this.snackBar.open('Note auto-dismissed', undefined, { duration: 500 });
  }
}
