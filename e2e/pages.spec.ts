import { test, expect } from '@playwright/test';

const PUBLIC_PAGES = [
  { path: '/faq', heading: 'Vanliga frågor' },
  { path: '/ordlista', heading: 'ordlista' },
  { path: '/bank-guide', heading: 'Bank-guide' },
  { path: '/om', heading: 'Sista Resan' },
  { path: '/integritetspolicy', heading: 'Integritetspolicy' },
  { path: '/anvandarvillkor', heading: 'Användarvillkor' },
];

for (const { path, heading } of PUBLIC_PAGES) {
  test(`${path} laddar och visar rubrik`, async ({ page }) => {
    await page.goto(path);
    const h1 = page.getByRole('heading', { level: 1 }).first();
    const text = await h1.textContent();
    expect(text?.toLowerCase()).toContain(heading.toLowerCase());
  });
}

test.describe('Bank-guide', () => {
  test('expanderar bankinfo vid klick', async ({ page }) => {
    await page.goto('/bank-guide');
    await page.getByText('Swedbank').click();
    await expect(page.getByText('Steg att följa')).toBeVisible();
    await expect(page.getByText('Dokument du behöver:')).toBeVisible();
  });
});

test.describe('Arvskalkylator', () => {
  test('visar formulär och beräkning', async ({ page }) => {
    await page.goto('/arvskalkylator');
    await expect(page.getByText('Arvskalkylator')).toBeVisible();
    await expect(page.getByText('Ekonomisk översikt')).toBeVisible();
    await expect(page.getByText('Arvsfördelning')).toBeVisible();
  });
});

// Exportera kräver auth — testas separat vid behov

// Skanner och Påminnelser kräver auth — testas separat vid behov

// Delägare-portal kräver auth — testas separat vid behov
