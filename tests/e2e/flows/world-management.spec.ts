import { test, expect } from "@playwright/test";

test.describe("World Management", () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await page.goto("/login");
    await page.getByLabel("Username").fill("test_dm");
    await page.getByLabel("Password").fill("TestPass1");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL("/dashboard");
  });

  test("given_authenticated_dm_when_creates_world_then_appears_on_dashboard_with_zero_counts", async ({
    page,
  }) => {
    // T038 — create world → appears on dashboard with counts
    await page.getByRole("button", { name: "Create World" }).click();

    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name").fill("Test Campaign World");
    await dialog.getByLabel("Description").fill("A world for testing");
    await dialog.getByRole("button", { name: "Create" }).click();

    await expect(
      page.getByText("Test Campaign World")
    ).toBeVisible();
    await expect(page.getByText("0 events")).toBeVisible();
  });

  test("given_existing_world_when_dm_edits_name_then_dashboard_shows_new_name", async ({
    page,
  }) => {
    // Create first
    await page.getByRole("button", { name: "Create World" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name").fill("Original Name");
    await dialog.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Original Name")).toBeVisible();

    // Edit
    await page
      .getByText("Original Name")
      .locator("..")
      .getByRole("button", { name: "Edit" })
      .click();
    const editDialog = page.getByRole("dialog");
    await editDialog.getByLabel("Name").fill("Updated Name");
    await editDialog.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Updated Name")).toBeVisible();
    await expect(page.getByText("Original Name")).not.toBeVisible();
  });

  test("given_existing_world_when_dm_deletes_then_world_gone_from_dashboard", async ({
    page,
  }) => {
    // Create first
    await page.getByRole("button", { name: "Create World" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name").fill("World To Delete");
    await dialog.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("World To Delete")).toBeVisible();

    // Delete with confirmation
    await page
      .getByText("World To Delete")
      .locator("..")
      .getByRole("button", { name: "Delete" })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Delete" })
      .click();

    await expect(page.getByText("World To Delete")).not.toBeVisible();
  });
});

// T048 — Region management e2e tests
test.describe("Region Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Username").fill("test_dm");
    await page.getByLabel("Password").fill("TestPass1");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL("/dashboard");

    // Create a world to work in
    await page.getByRole("button", { name: "Create World" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name").fill("Region Test World");
    await dialog.getByRole("button", { name: "Create" }).click();
    await page.getByText("Region Test World").click();
  });

  test("given_world_detail_page_when_creates_region_then_region_appears_with_zero_events", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add Region" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name").fill("Northern Reaches");
    await dialog.getByRole("button", { name: "Create" }).click();

    await expect(page.getByText("Northern Reaches")).toBeVisible();
    await expect(page.getByText("0 events")).toBeVisible();
  });

  test("given_existing_region_when_edits_name_then_updated_name_shown", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add Region" }).click();
    let dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name").fill("Old Region Name");
    await dialog.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Old Region Name")).toBeVisible();

    await page
      .getByText("Old Region Name")
      .locator("..")
      .getByRole("button", { name: "Edit" })
      .click();
    dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name").fill("New Region Name");
    await dialog.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("New Region Name")).toBeVisible();
    await expect(page.getByText("Old Region Name")).not.toBeVisible();
  });

  test("given_existing_region_when_deletes_with_confirmation_then_region_gone", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add Region" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name").fill("Region To Delete");
    await dialog.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Region To Delete")).toBeVisible();

    await page
      .getByText("Region To Delete")
      .locator("..")
      .getByRole("button", { name: "Delete" })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Delete" })
      .click();

    await expect(page.getByText("Region To Delete")).not.toBeVisible();
  });
});
