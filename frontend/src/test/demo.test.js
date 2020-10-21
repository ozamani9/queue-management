const puppeteer = require('puppeteer');

describe('Todo Vue', () => {
  let browser
  let page

  beforeAll(async () => {
      browser = await puppeteer.launch()
  })

  afterEach(async () => {
      await page.close()
    })

  afterAll(async () => {
    await browser.close()
  })

  describe('add task to the list', () => {
    beforeEach(async () => {
      page = await browser.newPage()
      await page.goto('http://localhost:3000')
    })

    it('should be possible to add task to the list', async () => {
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
    })
  })
})