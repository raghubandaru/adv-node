const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  // open the browser, open the new page etc.,
  page = await Page.build();

  // Navigate to root
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When user logged in", async () => {
  // this beforeEach is in context to describe
  beforeEach(async () => {
    // let user login first
    await page.login();

    // click on the red floating button on the bottom
    await page.click("a.btn-floating");
  });

  test("should see a blog creation form", async () => {
    // find the contents of first label
    const label = await page.getContentsOf("form label");

    // assertion to Blog Title
    expect(label).toEqual("Blog Title");
  });

  describe("And using valid inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "Custom Title");
      await page.type(".content input", "Custom Content");
      await page.click("button.teal");
    });

    test("on submission, takes to user review screen", async () => {
      const text = await page.getContentsOf("h5");
      expect(text).toEqual("Please confirm your entries");
    });

    test("on saving adds blog to index page (/blogs)", async () => {
      await page.click("button.green");
      await page.waitFor(".card");

      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf("p");

      expect(title).toEqual("Custom Title");
      expect(content).toEqual("Custom Content");
    });
  });

  describe("And when using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("button.teal");
    });

    test("the form shows error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".title .red-text");

      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});

describe("When user is not logged in", async () => {
  test("cannot create blog posts", async () => {
    const result = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: "Tic tac toe", content: "Basic game!" })
      }).then(res => res.json());
    });

    expect(result).toEqual({ error: "You must log in!" });
  });

  test("cannot retrieve list of blog posts", async () => {
    const result = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.json());
    });

    expect(result).toEqual({ error: "You must log in!" });
  });
});
