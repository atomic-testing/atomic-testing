import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { IExampleUnit, ScenePart, TestEngine, byDataTestId, byLinkedElement } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

export const LinkedElementExample = () => {
  return (
    <form>
      <label htmlFor="value-input" data-testid="input-label">
        Input
      </label>
      <input type="text" defaultValue="Something" id="value-input" />
    </form>
  );
};

export const linkedElementExampleScenePart = {
  textInput: {
    locator: byLinkedElement()
      .onLinkedElement(byDataTestId('input-label'))
      .extractAttribute('for')
      .toMatchMyAttribute('id'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export const linkedElementExample: IExampleUnit<typeof linkedElementExampleScenePart, JSX.Element> = {
  title: 'Linked Element',
  scene: linkedElementExampleScenePart,
  ui: <LinkedElementExample />,
};

export const linkedElementTestSuite: TestSuiteInfo<typeof linkedElementExample.scene> = {
  title: 'Linked Element',
  url: '/form',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${linkedElementExample.title}`, () => {
      let testEngine: TestEngine<typeof linkedElementExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(linkedElementExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Can locate input matched by label for', async () => {
        const targetValue = 'Something';
        const val = await testEngine.parts.textInput.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
