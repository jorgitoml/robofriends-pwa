const { expect, test } = require("@playwright/test");

test("preview renders the robot search and counter interaction", async ({
  page,
}) => {
  await page.route("https://jsonplaceholder.typicode.com/users", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          name: "Test Robot",
          email: "robot@example.test",
          username: "test-robot",
        },
      ]),
    }),
  );

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "RoboFriends" }),
  ).toBeVisible();

  await page.getByRole("searchbox", { name: "Search" }).fill("Test Robot");
  await expect(page.getByText("Test Robot")).toBeVisible();

  const counter = page.getByRole("button", { name: "Count: 1" });
  await counter.click();
  await expect(page.getByRole("button", { name: "Count: 2" })).toBeVisible();
});
