import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTMLCheckboxDriver, HTMLSelectDriver, HTMLTextInputDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, IExampleUIUnit, ScenePart } from '@atomic-testing/core';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form>
      <input data-testid="text" [(ngModel)]="text" name="text" />
      <input type="checkbox" data-testid="check" [(ngModel)]="checked" name="check" />
      <select data-testid="select" [(ngModel)]="selected" name="select">
        <option value="one">One</option>
        <option value="two">Two</option>
      </select>
    </form>
    <div data-testid="result">{{ text }} - {{ checked }} - {{ selected }}</div>
  `,
})
export class FormComponent {
  text = '';
  checked = false;
  selected = 'one';
}

export const formExampleUI: IExampleUIUnit<typeof FormComponent> = {
  title: 'Form',
  ui: FormComponent,
};

export const formScene = {
  textInput: { locator: byDataTestId('text'), driver: HTMLTextInputDriver },
  checkbox: { locator: byDataTestId('check'), driver: HTMLCheckboxDriver },
  select: { locator: byDataTestId('select'), driver: HTMLSelectDriver },
  result: { locator: byDataTestId('result'), driver: HTMLElementDriver },
} satisfies ScenePart;

export const formExample: IExampleUnit<typeof formScene, typeof FormComponent> = {
  ...formExampleUI,
  scene: formScene,
};
