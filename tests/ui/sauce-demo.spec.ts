import { test, expect, type Page } from '@playwright/test';

test.describe('Sauce Demo Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  test('should display inventory page after login', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/inventory.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('should be able to add item to cart', async ({ page }) => {
    const firstItem = page.locator('.inventory_item').first();
    const itemName = await firstItem.locator('.inventory_item_name').textContent();
    await firstItem.getByRole('button', { name: /Add to cart/i }).click();
    
    // Verify cart badge shows 1
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Go to cart and verify item
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*\/cart.html/);
    await expect(page.locator('.inventory_item_name')).toHaveText(String(itemName));
  });

  test('should be able to complete purchase', async ({ page }) => {
    // Add item to cart
    await page.getByRole('button', { name: /Add to cart/i }).first().click();
    await page.locator('.shopping_cart_link').click();
    
    // Checkout process
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill('Test');
    await page.getByPlaceholder('Last Name').fill('User');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Verify checkout overview and complete
    await expect(page.getByText('Checkout: Overview')).toBeVisible();
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
    await expect(page).toHaveURL(/.*\/checkout-complete.html/);
  });

  test('should be able to sort items', async ({ page }) => {
    // Get initial list of items
    const itemNames = await page.locator('.inventory_item_name').allTextContents();
    
    // Sort by Name (Z to A)
    await page.locator('select.product_sort_container').click();
    await page.selectOption('.product_sort_container', 'za');
    
    // Wait for items to be re-sorted
    await page.waitForTimeout(1000);
    
    // Get sorted list and verify it's in reverse alphabetical order
    const sortedItemNames = await page.locator('.inventory_item_name').allTextContents();
    
    // Create expected sorted array (Z to A)
    const expectedSortedNames = [...itemNames].sort((a, b) => b.localeCompare(a));
    
    // Verify the items are sorted correctly
    expect(sortedItemNames).toEqual(expectedSortedNames);
    
    // Additional verification - first item should be alphabetically after the last item
    expect(sortedItemNames[0].localeCompare(sortedItemNames[sortedItemNames.length - 1])).toBeGreaterThan(0);
  });

  test('should be able to logout', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/.*\//);
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });
});