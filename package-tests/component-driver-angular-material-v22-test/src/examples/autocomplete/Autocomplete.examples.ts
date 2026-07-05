import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

const FRUITS: readonly string[] = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry'];

/**
 * Example for the MatAutocomplete driver: a fruit autocomplete that filters
 * as the user types (case-insensitive prefix match) and echoes the selection
 * into an `<output>`, an unfiltered color autocomplete (with a disabled
 * option) so per-instance reads disambiguate, and a disabled+required one for
 * state accessors. `data-testid` sits on the trigger `<input>` — the
 * `role="combobox"` element; the option panel renders in a CDK overlay
 * outside it and the driver reaches it through the trigger's `aria-controls`
 * link. The heading is the neutral target for outside-click dismissal.
 */
@Component({
  selector: 'atomic-autocomplete-example',
  imports: [MatAutocomplete, MatAutocompleteTrigger, MatFormField, MatInput, MatLabel, MatOption],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h1 data-testid="page-title">Autocomplete</h1>

      <mat-form-field>
        <mat-label>Fruit</mat-label>
        <input matInput data-testid="fruit-input" [matAutocomplete]="fruitAuto" (input)="onFruitInput($event)" />
        <mat-autocomplete #fruitAuto (optionSelected)="onFruitSelected($event)">
          @for (option of fruitOptions(); track option) {
            <mat-option [value]="option">{{ option }}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Color</mat-label>
        <input matInput data-testid="color-input" [matAutocomplete]="colorAuto" />
        <mat-autocomplete #colorAuto>
          <mat-option value="red">Red</mat-option>
          <mat-option value="green">Green</mat-option>
          <mat-option value="blue" disabled>Blue</mat-option>
        </mat-autocomplete>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Locked</mat-label>
        <input matInput data-testid="locked-input" [matAutocomplete]="lockedAuto" disabled required />
        <mat-autocomplete #lockedAuto>
          <mat-option value="one">One</mat-option>
        </mat-autocomplete>
      </mat-form-field>

      <output data-testid="fruit-selection">{{ fruitSelection() }}</output>
    </section>
  `,
})
export class AutocompleteExampleComponent {
  readonly fruitFilter = signal('');
  readonly fruitSelection = signal('');
  readonly fruitOptions = computed(() => {
    const filter = this.fruitFilter().toLowerCase();
    return FRUITS.filter(fruit => fruit.toLowerCase().startsWith(filter));
  });

  onFruitInput(event: Event): void {
    this.fruitFilter.set((event.target as HTMLInputElement).value);
  }

  onFruitSelected(event: MatAutocompleteSelectedEvent): void {
    this.fruitSelection.set(event.option.value);
    // Mirror what a form binding would do: keep the filter in sync with the
    // committed value, so reopening shows the selection's matches.
    this.fruitFilter.set(event.option.value);
  }
}
