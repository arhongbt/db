import { test, expect } from '@playwright/test';

test.describe('Navigation & responsiveness', () => {
  test('alla dashboard-länkar ger 200', async ({ page }) => {
    const links = [
      '/arvskalkylator',
      '/juridisk-hjalp',
      '/bank-guide',
      '/konflikt',
      '/internationellt',
      '/foretag-i-dodsbo',
      '/ordlista',
      '/faq',
    ];

    for (const link of links) {
      const response = await page.goto(link);
      expect(response?.status(), `${link} ska returnera 200`).toBeLessThan(400);
    }
  });

  test('robots.txt finns', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const text = await page.textContent('body');
    expect(text?.toLowerCase()).toContain('user-agent');
  });

  test('sitemap.xml finns', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
  });

  test('manifest.json fungerar', async ({ page }) => {
    const response = await page.goto('/manifest.json');
    expect(response?.status()).toBe(200);
    const json = await response?.json();
    expect(json.name).toContain('Sista Resan');
  });
});

test.describe('Mobile responsiveness', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('landing page ser bra ut på mobil', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('Kom igång', { exact: false })).toBeVisible();

    // Ingen horisontell scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});
