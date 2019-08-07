// const puppeteer = require("puppeteer");

const Page = require("./helpers/page");

// let browser, page;
let page;

beforeEach(async () => {
  // browser = await puppeteer.launch({
  //   headless: false
  // });
  // page = await browser.newPage();
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("The header has the correct text", async () => {
  const text = await page.$eval("a.brand-logo", el => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("clicking login starts oauth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  console.log(url);
  expect(url).toMatch(/accounts\.google\.com/);
});

test("Checking for logout button, when signed in", async () => {
  // Create and Login the user
  await page.login();

  // select the DOM element and assert the value
  const text = await page.getContentsOf('a[href="/auth/logout"]');

  expect(text).toEqual("Logout");
});
