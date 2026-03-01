/* ============================================================
 * Project      : Finance Tracker App
 * File         : driverHelper.js
 * Description  : Factory function that creates and configures a
 *                Chrome WebDriver instance for Selenium tests.
 * Tester       : Bassam Ashraf
 * Date         : 2025-02-26
 * Version      : 1.0
 * Dependencies : Selenium WebDriver, chromedriver
 * ============================================================
 */

/*============================================================================================================================================== *
 *                                                               Imports                                                                         *
 *===============================================================================================================================================*/
// Builder   : Creates a new WebDriver instance for the specified browser.
// chrome    : Provides Chrome-specific options and service configuration.
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


/*============================================================================================================================================== *
 *                                                              Function                                                                         *
 *===============================================================================================================================================*/

/**
 * Creates and returns a configured Chrome WebDriver instance.
 * Resolves the local chromedriver binary path automatically via the
 * 'chromedriver' npm package, then builds and returns the driver.
 *
 * returns {Promise<WebDriver>} A ready-to-use Selenium Chrome WebDriver instance.
 */
async function createDriver()
{
    // Retrieve the absolute path to the local chromedriver binary.
    const chromedriverPath = require('chromedriver').path;
    console.log('🟢 chromedriver binary path:', chromedriverPath);

    // Configure ChromeService to use the resolved binary path.
    const service = new chrome.ServiceBuilder(chromedriverPath);

    // Build and return a Chrome WebDriver instance using the configured service.
    return await new Builder()
        .forBrowser('chrome')
        .setChromeService(service)
        .build();
}


/*============================================================================================================================================== *
 *                                                               Exports                                                                         *
 *===============================================================================================================================================*/
module.exports = { createDriver };