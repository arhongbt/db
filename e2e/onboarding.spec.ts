import { test, expect } from '@playwright/test';

test.describe('Onboarding flow', () => {
  test('kan fylla i steg 0 och gå vidare till relation', async ({ page }) => {
    await page.goto('/onboarding');

    // Steg 0: Vem har gått bort?
    await expect(page.getByText('Vi finns här för dig')).toBeVisible();
    await page.getByPlaceholder('Förnamn Efternamn').fill('Test Person');
    await page.locator('input[type="date"]').fill('2025-01-15');
    await page.getByText('Fortsätt').click();

    // Steg 1: Relation — ska finnas val
    await expect(page.getByText('Vilken är din relation?')).toBeVisible();
    await page.getByRole('button', { name: 'Barn Son eller dotter' }).click();
    await page.getByText('Fortsätt').click();

    // Steg 2: Familjesituation
    await expect(page.getByText('Familjesituation')).toBeVisible();
  });

  test('visar tillbakaknapp efter steg 0', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByPlaceholder('Förnamn Efternamn').fill('Test Person');
    await page.locator('input[type="date"]').fill('2025-01-15');
    await page.getByText('Fortsätt').click();

    // Bakåtknapp (ChevronLeft) ska finnas
    await expect(page.locator('button[aria-label="Gå tillbaka"]')).toBeVisible();
  });
});
