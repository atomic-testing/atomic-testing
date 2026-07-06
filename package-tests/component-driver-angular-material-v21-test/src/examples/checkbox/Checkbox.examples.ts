import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

/**
 * Example for the MatCheckbox driver: a wired checkbox recording its state, a
 * pre-checked sibling (label disambiguation), an indeterminate one, both
 * disabled flavors (native and `disabledInteractive`), a required one and a
 * label-less one. `data-testid` sits on the `<mat-checkbox>` host element —
 * the driver reaches the native input inside it.
 */
@Component({
  selector: 'atomic-checkbox-example',
  imports: [MatCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <mat-checkbox data-testid="terms" value="terms" (change)="onTermsChange($event)">Accept terms</mat-checkbox>
      <output data-testid="terms-state">{{ termsState() }}</output>
      <mat-checkbox data-testid="newsletter" [checked]="true">Subscribe to newsletter</mat-checkbox>
      <mat-checkbox data-testid="select-all" [indeterminate]="true">Select all</mat-checkbox>
      <mat-checkbox data-testid="disabled-checkbox" disabled>Disabled option</mat-checkbox>
      <mat-checkbox data-testid="interactive-disabled-checkbox" disabled disabledInteractive>
        Interactive disabled
      </mat-checkbox>
      <mat-checkbox data-testid="required-checkbox" required>Required option</mat-checkbox>
      <mat-checkbox data-testid="bare-checkbox" />
    </section>
  `,
})
export class CheckboxExampleComponent {
  readonly termsState = signal('initial');

  onTermsChange(event: MatCheckboxChange): void {
    this.termsState.set(String(event.checked));
  }
}
