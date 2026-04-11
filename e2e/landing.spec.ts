import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test('visar rubrik och CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Hantera dödsboet');
    await expect(page.getByText('Kom igång', { exact: false })).toBeVisible();
  });

  test('har SEO-meta', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toContain('Sista Resan');
  });

  test('footer-länkar fungerar', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Om oss').click();
    await expect(page).toHaveURL('/om');
    await expect(page.locator('h1')).toContainText('Sista Resan');
  });

  test('navigerar till onboarding', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Kom igång', { exact: false }).click();
    await expect(page).toHaveURL('/onboarding');
  });
});

test.describe('404-sida', () => {
  test('visar 404 för okänd sida', async ({ page }) => {
    await page.goto('/denna-sida-finns-inte');
    await expect(page.getByText('Sidan hittades inte')).toBeVisible();
  });
});
