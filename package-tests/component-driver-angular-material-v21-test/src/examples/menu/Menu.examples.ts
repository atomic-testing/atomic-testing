import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

/**
 * Example for the MatMenu driver: two independent menus so panel reads
 * disambiguate. Each `<mat-menu aria-label>` lands on the overlay panel
 * (`role="menu"`) — the driver's identity hook, since the panel renders in the
 * CDK overlay container where no `data-testid` can be forwarded. The selected
 * item is echoed into an `<output>`; one item is disabled for state reads.
 */
@Component({
  selector: 'atomic-menu-example',
  imports: [MatButton, MatMenu, MatMenuItem, MatMenuTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <button matButton [matMenuTriggerFor]="accountMenu" data-testid="account-menu-trigger">Account</button>
      <mat-menu #accountMenu aria-label="Account menu">
        <button mat-menu-item (click)="selection.set('Profile')">Profile</button>
        <button mat-menu-item (click)="selection.set('Settings')">Settings</button>
        <button mat-menu-item disabled>Logout</button>
      </mat-menu>

      <button matButton [matMenuTriggerFor]="sortMenu" data-testid="sort-menu-trigger">Sort</button>
      <mat-menu #sortMenu aria-label="Sort menu">
        <button mat-menu-item (click)="selection.set('Newest')">Newest</button>
        <button mat-menu-item (click)="selection.set('Oldest')">Oldest</button>
      </mat-menu>

      <output data-testid="menu-selection">{{ selection() }}</output>
    </section>
  `,
})
export class MenuExampleComponent {
  readonly selection = signal('');
}
