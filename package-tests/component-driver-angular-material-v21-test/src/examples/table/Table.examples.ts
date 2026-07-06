import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';

interface ChemicalElement {
  readonly position: number;
  readonly name: string;
  readonly symbol: string;
}

interface Fruit {
  readonly name: string;
  readonly color: string;
}

const ELEMENTS: readonly ChemicalElement[] = [
  { position: 1, name: 'Hydrogen', symbol: 'H' },
  { position: 2, name: 'Helium', symbol: 'He' },
  { position: 3, name: 'Lithium', symbol: 'Li' },
  { position: 4, name: 'Beryllium', symbol: 'Be' },
];

const FRUITS: readonly Fruit[] = [
  { name: 'Apple', color: 'Red' },
  { name: 'Banana', color: 'Yellow' },
  { name: 'Cherry', color: 'Dark Red' },
];

/**
 * Example for the MatTable driver, one fixture per rendering variant so the
 * suite proves the driver's role-based locators on both: a native
 * `<table mat-table>` (elements) and a flex `<mat-table>` (fruits). The two
 * hold different data so per-instance reads disambiguate. `data-testid` sits
 * on the table host — the `role="table"` element in both variants.
 */
@Component({
  selector: 'atomic-table-example',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <table mat-table [dataSource]="elements" data-testid="element-table">
        <ng-container matColumnDef="position">
          <th mat-header-cell *matHeaderCellDef>No.</th>
          <td mat-cell *matCellDef="let element">{{ element.position }}</td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let element">{{ element.name }}</td>
        </ng-container>
        <ng-container matColumnDef="symbol">
          <th mat-header-cell *matHeaderCellDef>Symbol</th>
          <td mat-cell *matCellDef="let element">{{ element.symbol }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="elementColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: elementColumns"></tr>
      </table>

      <mat-table [dataSource]="fruits" data-testid="fruit-table">
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef>Fruit</mat-header-cell>
          <mat-cell *matCellDef="let fruit">{{ fruit.name }}</mat-cell>
        </ng-container>
        <ng-container matColumnDef="color">
          <mat-header-cell *matHeaderCellDef>Color</mat-header-cell>
          <mat-cell *matCellDef="let fruit">{{ fruit.color }}</mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="fruitColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: fruitColumns"></mat-row>
      </mat-table>
    </section>
  `,
})
export class TableExampleComponent {
  readonly elements = ELEMENTS;
  readonly elementColumns = ['position', 'name', 'symbol'];
  readonly fruits = FRUITS;
  readonly fruitColumns = ['name', 'color'];
}
