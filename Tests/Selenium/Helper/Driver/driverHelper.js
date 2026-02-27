/* ============================================================
 * Project      : Finance Tracker App
 * File         : driver.js
 * Description  : Driver factory for the merchant registration
 * Tester       : Bassam Ashraf
 * Date         : 2025-02-26
 * Version      : 1.0
 * Dependencies : Selenium WebDriver, Mocha, Chai
 * ============================================================
 */

/*============================================================================================================================================== *
 *                                                               Imports                                                                         *
 *===============================================================================================================================================*/
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


/*============================================================================================================================================== *
 *                                                              Function                                                                         *
 *===============================================================================================================================================*/
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


/*============================================================================================================================================== *
 *                                                               Exports                                                                         *
 *===============================================================================================================================================*/
module.exports = { createDriver };