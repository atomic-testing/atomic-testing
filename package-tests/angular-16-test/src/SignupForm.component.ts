import { Component } from '@angular/core';

@Component({
  selector: 'app-signup-form',
  template: `
    <form (ngSubmit)="submit()">
      <input data-testid="name" [(ngModel)]="name" name="name" />
      <input data-testid="email" [(ngModel)]="email" name="email" />
      <button data-testid="submit" type="submit">Submit</button>
    </form>
    <div data-testid="message">{{ message }}</div>
  `,
})
export class SignupFormComponent {
  name = '';
  email = '';
  message = '';

  submit() {
    this.message = `Submitted: ${this.name} - ${this.email}`;
  }
}
