import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

/**
 * Example for the MatInput/MatFormField driver: a plain field with label and
 * hint, a required email field pre-seeded with an invalid touched value so its
 * `<mat-error>` shows from the start (deterministic error state without
 * interaction-order coupling), a multiline textarea field, and disabled /
 * readonly fields. `data-testid` sits on the `<mat-form-field>` host — the
 * driver reaches the `matInput` control and the label/hint/error DOM inside.
 */
@Component({
  selector: 'atomic-input-example',
  imports: [MatError, MatFormField, MatHint, MatInput, MatLabel, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <mat-form-field data-testid="name-field">
        <mat-label>Full name</mat-label>
        <input matInput />
        <mat-hint>First and last name</mat-hint>
      </mat-form-field>

      <mat-form-field data-testid="email-field">
        <mat-label>Email</mat-label>
        <input matInput required [formControl]="email" />
        <mat-error>Please enter a valid email address</mat-error>
      </mat-form-field>

      <mat-form-field data-testid="bio-field">
        <mat-label>Bio</mat-label>
        <textarea matInput></textarea>
      </mat-form-field>

      <mat-form-field data-testid="disabled-field">
        <mat-label>Locked</mat-label>
        <input matInput disabled value="Locked value" />
      </mat-form-field>

      <mat-form-field data-testid="readonly-field">
        <mat-label>Fixed</mat-label>
        <input matInput readonly value="Fixed value" />
      </mat-form-field>
    </section>
  `,
})
export class InputExampleComponent {
  readonly email = new FormControl('not-an-email', [Validators.required, Validators.email]);

  constructor() {
    // Material only shows errors once the control is touched (default
    // ErrorStateMatcher); mark it here so the error state is visible on load.
    this.email.markAsTouched();
  }
}
