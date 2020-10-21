let page;
let browser;
const width = 1200;
const height = 800;
const maxTestCaseTime = 30000;
const USER_DATA_DIR = 'c:\\temp\\jest';
const USER_DATA_DIR_WSL = '/mnt/c/temp/jest';
const puppeteer = require('puppeteer');


beforeAll(async () => {
    {
        const browser = await puppeteer.launch({
            ignoreDefaultArgs: ['--disable-extensions'],
          });
        const page = await browser.newPage()
        
        const navigationPromise = page.waitForNavigation()
        
        await navigationPromise
        
        await page.goto('https://www.google.com/')
        
        await page.setViewport({ width: 1920, height: 937 })
        
        await browser.close()
    }
});

describe("Login", () => {
    test(
      "Login",
      async () => {
        const browser = await puppeteer.launch({
            ignoreDefaultArgs: ['--disable-extensions'],
          });
        const page = await browser.newPage()
        
        const navigationPromise = page.waitForNavigation()
        
        await page.goto('https://dev-theq.pathfinder.gov.bc.ca/queue')
        
        await page.setViewport({ width: 1920, height: 937 })
        
        await page.waitForSelector('.navbar #login-button')
        await page.click('.navbar #login-button')
        
        await navigationPromise
        
        await navigationPromise
        
        await page.waitForSelector('.col-sm-7 > .panel > .panel-body > .login-form-action > .btn')
        await page.click('.col-sm-7 > .panel > .panel-body > .login-form-action > .btn')
        
        await navigationPromise
        
        await navigationPromise
        
        await browser.close()
      },
      maxTestCaseTime
    )
});