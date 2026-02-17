const { By, until, Select, Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function createDriver()
{
    console.log('Select chrome browser:',chrome);

    const chromedriverPath = require('chromedriver').path;
    console.log('Show path of driver:',chromedriverPath);

    const service = new chrome.ServiceBuilder(chromedriverPath);
    console.log('service configuration:',service);

    return await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .build();
}

module.exports = { createDriver };