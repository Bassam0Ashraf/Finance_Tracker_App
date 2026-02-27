/* ============================================================
 * Project      : Finance Tracker App
 * File         : locators.js
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
const { By, until } = require('selenium-webdriver');

/*============================================================================================================================================== *
 *                                                              Constants                                                                        *
 *===============================================================================================================================================*/
const TIMEOUT = 10000;
const SLEEP_SHORT = 2000;
const SLEEP_MEDIUM = 3500;
const SLEEP_LONG = 5000;

/*============================================================================================================================================== *
 *                                                              Function                                                                         *
 *===============================================================================================================================================*/

/**
 * Wait for an element to be located
 * parameters: {WebDriver} driver
 * parameters: {By} locator
 * parameters: {number} timeout
 * returns: {Promise<WebElement>}
 */
async function waitFor(driver, locator, timeout = TIMEOUT) {
    return driver.wait(until.elementLocated(locator), timeout);
}

/**
 * Wait for an element to be visible
 * parameters: {WebDriver} driver
 * parameters: {By} locator
 * parameters: {number} timeout
 * returns: {Promise<WebElement>}
 */
async function waitVisible(driver, locator, timeout = TIMEOUT) {
    const el = await waitFor(driver, locator, timeout);
    await driver.wait(until.elementIsVisible(el), timeout);
    return el;
}

/**
 * Wait for an alert to be present
 * parameters: {WebDriver} driver
 * parameters: {number} timeout
 * returns: {Promise<Alert>}
 */
async function waitForAlert(driver, timeout = TIMEOUT) {
    return driver.wait(until.alertIsPresent(), timeout);
}

/**
 * Wait for elements to be located and return all matching elements
 * parameters: {WebDriver} driver
 * parameters: {By} locator
 * parameters: {number} timeout
 * returns: {Promise<WebElement[]>}
 */
async function waitForElements(driver, locator, timeout = TIMEOUT) {
    await driver.wait(until.elementLocated(locator), timeout);
    return driver.findElements(locator);
}

/**
 * Get text from an element safely
 * parameters: {WebDriver} driver
 * parameters: {By} locator
 * returns: {Promise<string>}
 */
async function safeText(driver, locator) {
    try {
        const el = await waitFor(driver, locator, SLEEP_LONG);
        return el.getText();
    } catch {
        return '';
    }
}

/*============================================================================================================================================== *
 *                                                               Exports                                                                         *
 *===============================================================================================================================================*/
module.exports = { waitFor, waitVisible, waitForAlert, waitForElements, safeText, SLEEP_SHORT, SLEEP_MEDIUM, SLEEP_LONG, TIMEOUT };