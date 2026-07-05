import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';

/**
 * Example for the MatSlideToggle driver: a wired toggle recording its state, a
 * pre-checked sibling (label disambiguation), and disabled/required instances.
 * `data-testid` sits on the `<mat-slide-toggle>` host element — the driver
 * reaches the `role="switch"` button inside it.
 */
@Component({
  selector: 'atomic-slide-toggle-example',
  imports: [MatSlideToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <mat-slide-toggle data-testid="wifi" (change)="onWifiChange($event)">Wi-Fi</mat-slide-toggle>
      <output data-testid="wifi-state">{{ wifiState() }}</output>
      <mat-slide-toggle data-testid="bluetooth" [checked]="true">Bluetooth</mat-slide-toggle>
      <mat-slide-toggle data-testid="disabled-toggle" disabled>Disabled toggle</mat-slide-toggle>
      <mat-slide-toggle data-testid="required-toggle" required>Required toggle</mat-slide-toggle>
    </section>
  `,
})
export class SlideToggleExampleComponent {
  readonly wifiState = signal('initial');

  onWifiChange(event: MatSlideToggleChange): void {
    this.wifiState.set(String(event.checked));
  }
}
