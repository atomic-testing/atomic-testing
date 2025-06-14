import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ScenePart, byDataTestId } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/playwright';
import { expect, test } from '@playwright/test';
import { AppDataTestId } from '../src/AppDataTestId';
import { BillingAddressFormDriver } from '../src/components/billingAddressForm/BillingAddressFormDriver';
import { CredentialFormDriver } from '../src/components/credentialForm/CredentialFormDriver';
import { InterestFormDriver } from '../src/components/interestForm/InterestFormDriver';
import { ShippingAddressFormDriver } from '../src/components/shippingAddressForm/ShippingAddressFormDriver';
import { SignupReviewDriver } from '../src/components/signupReview/SignupReviewDriver';
import {
  getGoodBillingMock,
  getGoodCredentialMock,
  getGoodInterestMock,
  getGoodShippingMock
} from '../src/models/__mocks__/SignupModelMock';

const parts = {
  stepper: {
    locator: byDataTestId(AppDataTestId.stepper),
    // There is no driver for stepper yet, but once it is implemented
    // we can add it and test each step of the way
    driver: HTMLElementDriver
  },
  credentialStep: {
    locator: byDataTestId(AppDataTestId.credential),
    driver: CredentialFormDriver
  },
  shippingStep: {
    locator: byDataTestId(AppDataTestId.shipping),
    driver: ShippingAddressFormDriver
  },
  billingStep: {
    locator: byDataTestId(AppDataTestId.billing),
    driver: BillingAddressFormDriver
  },
  interestStep: {
    locator: byDataTestId(AppDataTestId.interest),
    driver: InterestFormDriver
  },
  reviewStep: {
    locator: byDataTestId(AppDataTestId.review),
    driver: SignupReviewDriver
  },
  confirmationStep: {
    locator: byDataTestId(AppDataTestId.confirmation),
    driver: HTMLElementDriver
  }
} satisfies ScenePart;

test('Success submission', async ({ page }) => {
  await page.goto('/');
  const testEngine = createTestEngine(page, parts);

  await expect(await testEngine.parts.credentialStep.isVisible(), 'Credential form is shown first').toBe(true);

  // Fill in credential form, click Next, and expect shipping form to be shown
  await testEngine.parts.credentialStep.setValue(getGoodCredentialMock());
  await testEngine.parts.credentialStep.next();
  await expect(await testEngine.parts.shippingStep.isVisible(), 'Shipping address form should be shown').toBe(true);

  // Fill in shipping form, click Next, and expect billing form to be shown
  await testEngine.parts.shippingStep.setValue(getGoodShippingMock());
  await testEngine.parts.shippingStep.next();
  await expect(await testEngine.parts.billingStep.isVisible(), 'Billing address form should be shown').toBe(true);

  // Fill in billing form, click Next, and expect interest form to be shown
  await testEngine.parts.billingStep.setValue(getGoodBillingMock());
  await testEngine.parts.billingStep.next();
  await expect(await testEngine.parts.interestStep.isVisible(), 'Interest form should be shown').toBe(true);

  // Fill in interest form, click Next, and expect review form to be shown
  await testEngine.parts.interestStep.setValue(getGoodInterestMock());
  await testEngine.parts.interestStep.next();
  await expect(await testEngine.parts.reviewStep.isVisible(), 'Review form should be shown').toBe(true);
  await expect(await testEngine.parts.stepper.isVisible(), 'Stepper should remain shown').toBe(true);

  await testEngine.parts.reviewStep.next();
  await expect(await testEngine.parts.confirmationStep.isVisible(), 'Confirmation page should be shown').toBe(true);
  await expect(await testEngine.parts.stepper.isVisible(), 'Stepper should not be visible at confirmation page').toBe(
    false
  );
});
