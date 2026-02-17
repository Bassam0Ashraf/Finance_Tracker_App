/*const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Simple Chrome Test', function () {
    this.timeout(60000);

    let driver;

    before(async function () {
        console.log('Creating driver...');

        const chromedriverPath = require('chromedriver').path;
        const service = new chrome.ServiceBuilder(chromedriverPath);

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeService(service)
            .build();

        console.log('Driver created!');
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('should open Google', async function () {
        await driver.get('https://www.google.com');
        console.log('Google opened!');
    });
});
*/
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Simple Chrome Test', function () {
    this.timeout(60000);

    let driver;

    before(async function () {
        console.log('Creating driver...');

        const chromedriverPath = require('chromedriver').path;
        const service = new chrome.ServiceBuilder(chromedriverPath);

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeService(service)
            .build();

        console.log('Driver created!');
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('should open Google', async function () {
        await driver.get('https://www.google.com');
        console.log('Google opened!');
    });
});
