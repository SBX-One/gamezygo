import { test, expect } from "@playwright/test";

test.describe("Gamezygo Smoke E2E", () => {
  test("landing page loads with Gamezygo branding", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Gamezygo/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("store page loads cleanly", async ({ page }) => {
    await page.goto("/store");
    await expect(page).toHaveURL(/\/store/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("customer /login does not expose admin login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /google/i }).first()
    ).toBeVisible();
  });

  test("dedicated /admin/login renders administrator credentials form", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(
      page.getByRole("button", { name: /masuk|login/i }).first()
    ).toBeVisible();
  });

  test("unauthenticated access to /admin/dashboard redirects to /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("leaderboard loads without #67 placeholder", async ({ page }) => {
    await page.goto("/leaderboard");
    await expect(page).toHaveURL(/\/leaderboard/);
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("#67", { exact: true })).toHaveCount(0);
  });

  test("reviews page loads cleanly", async ({ page }) => {
    await page.goto("/review");
    await expect(page).toHaveURL(/\/review/);
    await expect(page.locator("body")).toBeVisible();
  });
});
