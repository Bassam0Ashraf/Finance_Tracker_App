/* ============================================================
 * Project      : Finance Tracker App
 * File         : waitUtils.js
 * Description  : Reusable Selenium wait utilities and timeout
 *                constants shared across all test suites.
 * Tester       : Bassam Ashraf
 * Date         : 2025-02-26
 * Version      : 1.0
 * Dependencies : Selenium WebDriver
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
 * Waits until the specified element is located in the DOM and returns it.
 * param   {WebDriver}        driver  - Active Selenium WebDriver instance.
 * param   {By}               locator - Selenium locator strategy (e.g. By.id, By.css).
 * param   {number}           timeout - Maximum wait time in milliseconds (default: TIMEOUT).
 * returns {Promise<WebElement>}        The located DOM element.
 */
async function waitFor(driver, locator, timeout = TIMEOUT) {
    return driver.wait(until.elementLocated(locator), timeout);
}

/**
 * Waits until the specified element is located AND visible on the page, then returns it.
 * param   {WebDriver}        driver  - Active Selenium WebDriver instance.
 * param   {By}               locator - Selenium locator strategy (e.g. By.id, By.css).
 * param   {number}           timeout - Maximum wait time in milliseconds (default: TIMEOUT).
 * returns {Promise<WebElement>}        The located and visible DOM element.
 */
async function waitVisible(driver, locator, timeout = TIMEOUT) {
    const el = await waitFor(driver, locator, timeout);
    await driver.wait(until.elementIsVisible(el), timeout);
    return el;
}

/**
 * Waits until a browser alert dialog is present and returns it.
 * param   {WebDriver}    driver  - Active Selenium WebDriver instance.
 * param   {number}       timeout - Maximum wait time in milliseconds (default: TIMEOUT).
 * returns {Promise<Alert>}         The alert object, ready to be accepted or dismissed.
 */
async function waitForAlert(driver, timeout = TIMEOUT) {
    return driver.wait(until.alertIsPresent(), timeout);
}

/**
 * Waits until at least one element matching the locator exists, then returns ALL matching elements.
 * param   {WebDriver}          driver  - Active Selenium WebDriver instance.
 * param   {By}                 locator - Selenium locator strategy (e.g. By.className, By.css).
 * param   {number}             timeout - Maximum wait time in milliseconds (default: TIMEOUT).
 * returns {Promise<WebElement[]>}        Array of all matching DOM elements.
 */
async function waitForElements(driver, locator, timeout = TIMEOUT) {
    await driver.wait(until.elementLocated(locator), timeout);
    return driver.findElements(locator);
}

/**
 * Attempts to retrieve the text content of an element. Returns an empty string if the element
 * is not found or any error occurs, preventing the test from throwing unexpectedly.
 * param   {WebDriver}     driver  - Active Selenium WebDriver instance.
 * param   {By}            locator - Selenium locator strategy (e.g. By.id, By.css).
 * returns {Promise<string>}         The element's text content, or an empty string on failure.
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