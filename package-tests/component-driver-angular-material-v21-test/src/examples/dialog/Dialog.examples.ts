import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

/**
 * Dialog content opened through the MatDialog service. The `mat-dialog-title`
 * heading is what the container's `aria-labelledby` points at (the link the
 * driver's `getTitle()` resolves); the action buttons close with distinct
 * results so the host component can record how the dialog was dismissed.
 */
@Component({
  selector: 'atomic-dialog-content-example',
  imports: [MatButton, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Archive note</h2>
    <mat-dialog-content>Archived notes can be restored within 30 days.</mat-dialog-content>
    <mat-dialog-actions>
      <button matButton mat-dialog-close data-testid="cancel-button">Cancel</button>
      <button matButton [mat-dialog-close]="true" data-testid="archive-button">Archive</button>
    </mat-dialog-actions>
  `,
})
export class DialogContentExampleComponent {}

/**
 * Example for the MatDialog driver: a trigger button opens the dialog with a
 * fixed config `id` (the container's stable identity — MatDialog offers no
 * `data-testid` hook), and the close result is echoed into an `<output>` so
 * every close path (action button, backdrop click, Escape) is observable.
 */
@Component({
  selector: 'atomic-dialog-example',
  imports: [MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <button matButton data-testid="dialog-open-trigger" (click)="openDialog()">Open dialog</button>
      <output data-testid="dialog-result">{{ result() }}</output>
    </section>
  `,
})
export class DialogExampleComponent {
  private readonly dialog = inject(MatDialog);
  readonly result = signal('');

  openDialog(): void {
    this.result.set('');
    const ref = this.dialog.open(DialogContentExampleComponent, { id: 'archive-dialog' });
    ref.afterClosed().subscribe(value => {
      this.result.set(value === true ? 'archived' : 'dismissed');
    });
  }
}
