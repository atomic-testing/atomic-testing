import { NgComponentOutlet } from '@angular/common';
import { Component, Type } from '@angular/core';

import { directory, ExampleEntry } from './directory';

/**
 * Example-app shell: renders the example registered for the current pathname,
 * or an index of links when no example matches (the `/` home page).
 */
@Component({
  selector: 'atomic-example-app',
  imports: [NgComponentOutlet],
  template: `
    @if (example) {
      <ng-container *ngComponentOutlet="example" />
    } @else {
      <main>
        <h1>Angular Material v21 driver examples</h1>
        <ul>
          @for (entry of entries; track entry.url) {
            <li>
              <a [href]="entry.url">{{ entry.title }}</a>
            </li>
          }
        </ul>
      </main>
    }
  `,
})
export class AppComponent {
  readonly entries: ReadonlyArray<ExampleEntry> = directory;
  readonly example: Type<unknown> | null =
    directory.find(entry => entry.url === document.location.pathname)?.component ?? null;
}
