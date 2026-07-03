import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

/**
 * Fixture component exercising the behaviors the Angular adapter must settle
 * correctly: synchronous signal updates from event handlers (settled by
 * `whenStable()` in both zone and zoneless modes), signal-bound inputs, and a
 * `setTimeout`-driven update — which zone.js tracks as a pending macrotask but
 * zoneless change detection does not, making the zone/zoneless settling
 * difference observable.
 */
@Component({
  selector: 'atomic-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <output data-testid="count">{{ count() }}</output>
    <button type="button" data-testid="increment" (click)="increment()">Increment</button>
    <button type="button" data-testid="increment-later" (click)="incrementLater()">Increment later</button>
    <input data-testid="name" [value]="name()" (input)="onNameInput($event)" />
    <p data-testid="greeting">{{ greeting() }}</p>
  `,
})
export class CounterComponent {
  readonly count = signal(0);
  readonly name = signal('');
  readonly greeting = computed(() => `Hello ${this.name()}`.trim());

  increment(): void {
    this.count.update(value => value + 1);
  }

  incrementLater(): void {
    setTimeout(() => this.count.update(value => value + 1), 50);
  }

  onNameInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }
}
