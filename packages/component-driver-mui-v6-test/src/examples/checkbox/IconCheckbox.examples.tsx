import { CheckboxDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';

//#region Example
export const IconCheckbox = () => {
  return (
    <Stack direction='row' spacing={10}>
      <Checkbox data-testid='favorite' icon={<FavoriteBorder />} checkedIcon={<Favorite />} value='favorite' />
      <Checkbox data-testid='bookmark' icon={<BookmarkBorderIcon />} checkedIcon={<BookmarkIcon />} value='bookmark' />
    </Stack>
  );
};

export const iconCheckboxExampleScenePart = {
  favorite: {
    locator: byDataTestId('favorite'),
    driver: CheckboxDriver,
  },
  bookmark: {
    locator: byDataTestId('bookmark'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

/**
 * Icon button example from MUI's website
 * @see https://mui.com/material-ui/react-checkbox/#icon
 */
export const iconCheckboxExample: IExampleUnit<typeof iconCheckboxExampleScenePart, JSX.Element> = {
  title: 'Icon Checkbox',
  scene: iconCheckboxExampleScenePart,
  ui: <IconCheckbox />,
};
//#endregion

export const iconCheckboxTestSuite: TestSuiteInfo<typeof iconCheckboxExample.scene> = {
  title: 'Icon Checkbox',
  url: '/checkbox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${iconCheckboxExample.title}`, () => {
      let testEngine: TestEngine<typeof iconCheckboxExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(iconCheckboxExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`favorite is not checked initially`, async () => {
        const selected = await testEngine.parts.favorite.isSelected();
        assertEqual(selected, false);
      });

      test(`bookmark is not checked initially`, async () => {
        const selected = await testEngine.parts.bookmark.isSelected();
        assertEqual(selected, false);
      });

      test(`switching favorite to checked should return true upon completion`, async () => {
        await testEngine.parts.favorite.setSelected(true);
        const selected = await testEngine.parts.favorite.isSelected();
        assertEqual(selected, true);
      });
    });
  },
};
