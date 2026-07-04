import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatRadioButton, MatRadioChange, MatRadioGroup } from '@angular/material/radio';

/**
 * Example for the MatRadioGroup/MatRadioButton drivers: a wired group with no
 * initial selection (one disabled button), and a second group with a
 * pre-selected value so group-level reads disambiguate. `data-testid` sits on
 * the `<mat-radio-group>`/`<mat-radio-button>` host elements — the drivers
 * reach the native radio inputs inside them.
 */
@Component({
  selector: 'atomic-radio-example',
  imports: [MatRadioButton, MatRadioGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <mat-radio-group data-testid="flavor-group" (change)="onFlavorChange($event)">
        <mat-radio-button data-testid="flavor-vanilla" value="vanilla">Vanilla</mat-radio-button>
        <mat-radio-button data-testid="flavor-chocolate" value="chocolate">Chocolate</mat-radio-button>
        <mat-radio-button data-testid="flavor-strawberry" value="strawberry" disabled>Strawberry</mat-radio-button>
      </mat-radio-group>
      <output data-testid="flavor-state">{{ flavorState() }}</output>

      <mat-radio-group data-testid="size-group" value="small">
        <mat-radio-button value="small">Small</mat-radio-button>
        <mat-radio-button value="large">Large</mat-radio-button>
      </mat-radio-group>
    </section>
  `,
})
export class RadioExampleComponent {
  readonly flavorState = signal('initial');

  onFlavorChange(event: MatRadioChange): void {
    this.flavorState.set(String(event.value));
  }
}
