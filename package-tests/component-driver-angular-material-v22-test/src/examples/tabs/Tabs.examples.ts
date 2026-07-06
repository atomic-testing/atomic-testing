import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

/**
 * Example for the MatTabGroup driver: a default group (first tab selected,
 * last tab disabled) and a second group pre-selected on its last tab so
 * group-level reads disambiguate. `data-testid` sits on the `<mat-tab-group>`
 * host element — the driver reaches the `role="tab"`/`role="tabpanel"`
 * elements inside it.
 */
@Component({
  selector: 'atomic-tabs-example',
  imports: [MatTab, MatTabGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <mat-tab-group data-testid="fruit-tabs">
        <mat-tab label="Apple">Apple content</mat-tab>
        <mat-tab label="Banana">Banana content</mat-tab>
        <mat-tab label="Cherry" disabled>Cherry content</mat-tab>
      </mat-tab-group>

      <mat-tab-group data-testid="color-tabs" [selectedIndex]="2">
        <mat-tab label="Red">Red content</mat-tab>
        <mat-tab label="Green">Green content</mat-tab>
        <mat-tab label="Blue">Blue content</mat-tab>
      </mat-tab-group>
    </section>
  `,
})
export class TabsExampleComponent {}
