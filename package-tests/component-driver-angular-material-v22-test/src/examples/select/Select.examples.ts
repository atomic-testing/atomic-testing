import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

/**
 * Example for the MatSelect driver: an initially empty select whose chosen
 * value is echoed into an `<output>` (proves the selection interaction), a
 * second select with a preset value so per-instance reads disambiguate, and a
 * disabled+required select for state accessors. `data-testid` sits on the
 * `<mat-select>` host — the `role="combobox"` element; the option panel
 * renders outside it (CDK overlay container on v20, inline top-layer popover
 * on v21/v22) and the driver reaches it through the host's `aria-controls`
 * link.
 */
@Component({
  selector: 'atomic-select-example',
  imports: [MatFormField, MatLabel, MatOption, MatSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <mat-form-field>
        <mat-label>Fruit</mat-label>
        <mat-select data-testid="fruit-select" (selectionChange)="fruit.set($event.value)">
          <mat-option value="apple">Apple</mat-option>
          <mat-option value="banana">Banana</mat-option>
          <mat-option value="cherry" disabled>Cherry</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Color</mat-label>
        <mat-select data-testid="color-select" value="green">
          <mat-option value="red">Red</mat-option>
          <mat-option value="green">Green</mat-option>
          <mat-option value="blue">Blue</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Locked</mat-label>
        <mat-select data-testid="locked-select" disabled required>
          <mat-option value="one">One</mat-option>
        </mat-select>
      </mat-form-field>

      <output data-testid="fruit-value">{{ fruit() }}</output>
    </section>
  `,
})
export class SelectExampleComponent {
  readonly fruit = signal('');
}
