import { test, expect } from "@playwright/test";

test.describe("Registration flow", () => {
  test("given new user, when registers with valid credentials, then redirected to dashboard", async ({
    page,
  }) => {
    await page.goto("/register");
    await page.getByLabel("Username").fill(`dm_${Date.now()}`);
    await page.getByLabel("Password").fill("SecurePass1");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page).toHaveURL("/dashboard");
  });
});

test.describe("Login flow", () => {
  test("given unauthenticated user, when accesses /dashboard, then redirected to /login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });

  test("given existing user, when logs in, then sees world list", async ({
    page,
  }) => {
    // Requires a seeded test user — implement with fixture in T022
    test.skip(true, "Requires seeded database");
  });
});
