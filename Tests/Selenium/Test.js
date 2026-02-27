/* ============================================================
 * Project      : Finance Tracker App
 * File         : Test.js
 * Description  : Test cases for
 * Tester       : Bassam Ashraf
 * Date         : 2025-02-26
 * Version      : 1.0
 * Dependencies : Selenium WebDriver, Mocha, Chai
 * ============================================================
 */ 

// ============================================
// IMPORT REQUIRED MODULES
// ============================================
// selenium-webdriver: Main library for browser automation
// Builder: Creates a new browser driver instance
// By: Used to locate elements on the page (by ID, class, CSS, etc.)
// until: Provides wait conditions (wait until element appears, etc.)
// Import the FinanceTrackerPage class. This is a page object model for the finance tracker app.
// path: Node.js built-in module for working with file paths
// Helps us build correct file paths regardless of operating system
// /* Comment for the package.json file:
//  *  "test": "mocha Tests/Selenium/test/**/*.test.js --timeout 60000"
//  *  (**) = I don't care how deep the file is and it can be in any folder, Search this folder AND ALL subfolders.
//  *  (*.test.js) = but it MUST be a test file and the test file name must be test.js, Match files inside this folder only.
//  */

  
/*============================================================================================================================================== *
 *                                                               Imports                                                                         *
 *===============================================================================================================================================*/
   const { createDriver } = require('./Helper/Driver/driverHelper');
   const { waitFor, SLEEP_SHORT, SLEEP_MEDIUM, SLEEP_LONG, TIMEOUT } = require('./Helper/Utils/waitUtils');
   const {FinanceTrackerPage, FinancialOverview, TransactionList } = require('./Helper/Pages/FinanceTrackerPage');
   const path = require('path');   
   const { expect, assert } = require('chai');
   const { By } = require('selenium-webdriver');


/*============================================================================================================================================== *
 *                                                             Test Suite                                                                        *
 *===============================================================================================================================================*/

   describe('Automation Test For Finance Tracker App', function () 
   {

/*============================================================================================================================================== *
 *                                                   Test Suite for Description Field                                                            *
 *===============================================================================================================================================*/

   describe('Description Field Test Suite', function () 
   {
    let driver;
    let page;
    let overview;

    before(async function () 
    {
        console.log('\n🟢 Step 1: beforeEach started');
        
        try {
            console.log('🟢 Step 2: About to create driver...');
            
            driver = await createDriver();
            
            console.log('🟢 Step 3: Driver created successfully!');
            
            const htmlPath = path.join(__dirname, '..', '..', 'App', 'finance_tracker_app.html');
            console.log('🟢 Step 4: HTML Path:', htmlPath);
            
            const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
            console.log('🟢 Step 5: File URL:', fileUrl);
            
            await driver.get(fileUrl);
            console.log('🟢 Step 6: Navigated to page');
            
            await driver.manage().window().maximize();
            console.log('🟢 Step 7: Window maximized');
            
            page = new FinanceTrackerPage(driver);
            overview = new FinancialOverview(driver);
            transcationlist = new TransactionList(driver);
            console.log('🟢 Step 8: Page object created');

        // Verify that page opened successfully.
        const HeaderPage = await waitFor(driver, By.css('.header h1'), TIMEOUT);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();
        console.log('🟢 Step 9: Verify that page opened successfully.');

        // Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('✅ Header assertion passed!\n');            
            
        } catch (error)
        {
            console.log('');
            console.log('\n🔴 ERROR:', error.message);
            throw error;
        }
        
        
    });

    after(async function () 
    {
        console.log('\n🔒 Closing browser...');
        await driver.quit();
    });

    
    /*****************************************************************************************************
    * Test ID        : TC-001
    * Test Case      : Empty Description Field
    * Test Technique : Equivalence Partitioning — Invalid partition (empty input)
    *
    * Description    : Verify that submitting the form with an empty Description field is rejected,
    *                  the browser's native required-field validation triggers, and the balance
    *                  remains unchanged.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Leave the Description field empty.
    *                  4. Fill the remaining fields:
    *                       - Amount   : 100
    *                       - Type     : Income
    *                       - Category : Salary
    *                  5. Click "Add Transaction".
    *                  6. Assert the Description field's validity state is invalid.
    *                  7. Assert the balance has not changed.
    *
    * Expected Result : The form is not submitted. The Description field reports invalid
    *                   (browser native validation). Balance remains $0.00.
    *******************************************************************************************************/
    it('TC-001: Empty Description Field', async function ()
    {
        console.log('🔎 TC-001: Empty Description Field');

        // Step 3 & 4: Fill all required fields except Description
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Store balance before clicking Add Transaction
        let balanceBefore = await overview.getBalanceString();
        console.log('Balance before submit =', balanceBefore);

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Assert the Description field is flagged as invalid by the browser
        const isValid = await driver.executeScript(`return document.getElementById('description').validity.valid;`);
        assert.equal(isValid, false, 'Description field should be invalid when empty');
        console.log('✅ Description field correctly marked invalid when empty');

        // Step 7: Assert the balance has not changed (transaction was not added)
        let balanceAfter = await overview.getBalanceString();
        console.log('Balance after submit =', balanceAfter);
        expect(balanceAfter).to.equal(balanceBefore);
        console.log('✅ Balance unchanged assertion passed:', balanceBefore);

        
/*==================================================================================================================
        // These method to understand how to verify pop up massage "please fill out this field." and to check
           it using different ways becuase it's not HTML code or attributes it's related to DOM properties.

        // Test A: Get HTML attribute
        const requiredAttr = await description.getAttribute('required');
        console.log('A - required attribute:', requiredAttr);
        
        // Test B: Try to get JavaScript property with getAttribute
        const validityAttr = await description.getAttribute('validity');
        console.log('B - validity attribute:', validityAttr);
        
        // Test C: Get JavaScript property with executeScript
        const validityProp = await driver.executeScript(`
            return document.getElementById('description').validity;
        `);
        console.log('C - validity property:', validityProp);
        
        // Test D: Get validationMessage with executeScript
        const validationMsg = await driver.executeScript(`
            return document.getElementById('description').validationMessage;
        `);
        console.log('D - validationMessage property:', validationMsg);

        // Test E: Get required property
        const isRequiredProp = await driver.executeScript(
            'return document.getElementById("description").required;'
          );
          console.log('E - required property:',isRequiredProp);
 */         
/*
//==============================================================================================================
        // These method how to verify pop up massage "please fill out this field."

        // Method 1: Check if description field is valid according to browser
        const isValid = await driver.executeScript(`return document.getElementById('description').validity.valid;`);
        assert.equal(isValid, false, 'Description field should be invalid when empty');

        // Method 2: Check specific validation state
        const valueMissing = await driver.executeScript(`return document.getElementById('description').validity.valueMissing;`);
        expect(valueMissing).to.be.true;
        console.log('✅ Field is empty (valueMissing)');

        // Method 3: Get the validation message
        const message = await driver.executeScript(`return document.getElementById('description').validationMessage;`);
        expect(message).to.equal('Please fill out this field.');
        console.log('✅ Validation message:', message);

        // Method 4: Check required attribute exists
        const hasRequired = await driver.executeScript(`return document.getElementById('description').hasAttribute('required');`);
        expect(hasRequired).to.be.true;
        console.log('✅ Required attribute exists');
//==============================================================================================================
*/
    });


    /*****************************************************************************************************
    * Test ID        : TC-002
    * Test Case      : Whitespace-Only Description Field
    * Test Technique : Equivalence Partitioning — Invalid partition (whitespace-only input)
    *
    * Description    : Verify that a description containing only spaces is treated as empty,
    *                  the application displays the error "Description is required", and the
    *                  balance remains unchanged.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter a single space in the Description field.
    *                  4. Fill the remaining fields:
    *                       - Amount   : 100
    *                       - Type     : Income
    *                       - Category : Salary
    *                  5. Click "Add Transaction".
    *                  6. Assert the error message "Description is required" is displayed.
    *                  7. Assert the balance has not changed.
    *
    * Expected Result : Error message "Description is required" is shown. Balance remains $0.00.
    *******************************************************************************************************/
    it('TC-002: whitespace only at Description Field', async function ()
    {
        console.log('🔎 TC-002: Whitespace-Only Description Field');

        // Step 3 & 4: Fill required fields with whitespace-only description
        await page.fillDescription(' ');
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Store balance before clicking Add Transaction
        let balanceBefore = await overview.getBalanceString();
        console.log('Balance before submit =', balanceBefore);

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Assert the application-level error message is shown
        const desErrorMessage = await waitFor(driver, By.id('descriptionError'), SLEEP_LONG); 
        const desErrorMessageText = await desErrorMessage.getText();
        assert.equal(desErrorMessageText, 'Description is required', 'Error message should be "Description is required"');
        console.log('✅ Description error message assertion passed');

        // Step 7: Assert the balance has not changed (transaction was not added)
        let balanceAfter = await overview.getBalanceString();
        console.log('Balance after submit =', balanceAfter);
        expect(balanceAfter).to.equal(balanceBefore);
        console.log('✅ Balance unchanged assertion passed:', balanceBefore);

    });




    /*****************************************************************************************************
    * Test ID        : TC-003
    * Test Case      : Minimum Length Description Field (1 Character)
    * Test Technique : Boundary Value Analysis — Lower boundary (min = 1 character)
    *
    * Description    : Verify that a description of exactly 1 character (the minimum allowed)
    *                  is accepted and the transaction is added successfully to the list.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter exactly 1 character in the Description field: "a"
    *                  4. Fill the remaining fields:
    *                       - Amount   : 100
    *                       - Type     : Income
    *                       - Category : Salary
    *                       - Notes    : "test note"
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction in the list shows description "a".
    *
    * Expected Result : Transaction is accepted and the description "a" appears at the top of
    *                   the transaction list.
    *******************************************************************************************************/
    it('TC-003: Minimum Length Description Field (1 Character)', async function ()
    {
        console.log('🔎 TC-003: Minimum Length Description Field (1 Character)');

        let index = 0;

        // Step 3 & 4: Fill all fields with 1-character description
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');
        await page.fillNotes('test note');

        // Step 5: Click Add Transaction
        await page.addTransaction();
        
        // Step 6: Verify the newest transaction shows description "a"
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('a');
        console.log('✅ Minimum length (1 character) description accepted, assertion passed');

    });


// ⚠️ UI BUG NOTE: When description text is too long, it breaks the layout —
//    the Delete button is pushed off-screen and the Balance amount is hidden.
    /*****************************************************************************************************
    * Test ID        : TC-004
    * Test Case      : Maximum Length Description Field (100 Characters)
    * Test Technique : Boundary Value Analysis — Upper boundary (max = 100 characters)
    *
    * Description    : Verify that a description of exactly 100 characters (the maximum allowed)
    *                  is accepted and the transaction appears correctly in the transaction list.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter exactly 100 characters in the Description field.
    *                  4. Fill the remaining fields:
    *                       - Amount   : 100
    *                       - Type     : Income
    *                       - Category : Salary
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction shows the full 100-character description.
    *
    * Expected Result : Transaction is accepted and the full 100-character description is
    *                   stored and displayed correctly.
    *******************************************************************************************************/
    it('TC-004: Maximum Length Description Field (100 Characters)', async function ()
    {
        console.log('🔎 TC-004: Maximum Length Description Field (100 Characters)');

        let index = 0;

        // Step 3 & 4: Fill all fields with exactly 100-character description
        await page.fillDescription('QR3POSZ2rqdbZgBnG6mIwIE7d9ZRsZ4RM0Qm5EhdTIv21mPS59yissZz9yBfo7rsqZFZHWC8Zlltl6cVOfnerJlaZFTjz4LQv2O4');
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Verify the newest transaction shows the full 100-character description
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('QR3POSZ2rqdbZgBnG6mIwIE7d9ZRsZ4RM0Qm5EhdTIv21mPS59yissZz9yBfo7rsqZFZHWC8Zlltl6cVOfnerJlaZFTjz4LQv2O4');
        console.log('✅ Maximum length (100 characters) description accepted, assertion passed');
    });

// ⚠️ UI BUG NOTE: When description text is too long, it breaks the layout —
//    the Delete button is pushed off-screen and the Balance amount is hidden.
    /*****************************************************************************************************
    * Test ID        : TC-005
    * Test Case      : Description Field Exceeds Maximum Length (101 Characters)
    * Test Technique : Boundary Value Analysis — Just above upper boundary (max+1 = 101 characters)
    *
    * Description    : Verify that a description of 101 characters is rejected, the application
    *                  displays the error "Description must be less than 100 characters", and the
    *                  transaction is not added to the list.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter 101 characters in the Description field.
    *                  4. Fill the remaining fields:
    *                       - Amount   : 100
    *                       - Type     : Income
    *                       - Category : Salary
    *                  5. Click "Add Transaction".
    *                  6. Assert the transaction was NOT added to the list.
    *                  7. Assert the error message "Description must be less than 100 characters" is shown.
    *
    * Expected Result : Form is rejected. Error message "Description must be less than 100 characters"
    *                   is displayed. No transaction is added.
    *******************************************************************************************************/
    it('TC-005: Description Field Exceeds Maximum Length (101 Characters)', async function ()
    {
        console.log('🔎 TC-005: Description Field Exceeds Maximum Length (101 Characters)');

        let index = 0;

        // Step 3 & 4: Fill all fields with 101-character description
        await page.fillDescription('QR3POSZ2rqdbZgBnG6mIwIE7d9ZRsZ4RM0Qm5EhdTIv21mPS59yissZz9yBfo7rsqZFZHWC8Zlltl6cVOfnerJlaZFTjz4LQv2O41');
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Assert the transaction was NOT added to the list
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.description).not.equal('QR3POSZ2rqdbZgBnG6mIwIE7d9ZRsZ4RM0Qm5EhdTIv21mPS59yissZz9yBfo7rsqZFZHWC8Zlltl6cVOfnerJlaZFTjz4LQv2O41');
        console.log('✅ 101-character description correctly rejected, transaction not added');

        // Step 7: Assert the error message is displayed
        const descriptionError = await (await waitFor(driver, By.id('descriptionError'), SLEEP_LONG)).getText();
        expect(descriptionError).to.equal('Description must be less than 100 characters');
        console.log('✅ Description error message displayed correctly:', descriptionError);
    });




    
    });




/*============================================================================================================================================== *
 *                                                   Test Suite for Amount Field                                                                 *
 *===============================================================================================================================================*/

   describe('Amount Field Test Suite', function () 
   {
 let driver;
 let page;
 let overview;

 before(async function () 
 { 
    console.log('\n🟢 Step 1: beforeEach started');
     
     try {
         console.log('🟢 Step 2: About to create driver...');
         
         driver = await createDriver();
         
         console.log('🟢 Step 3: Driver created successfully!');
         
         const htmlPath = path.join(__dirname, '..', '..', 'App', 'finance_tracker_app.html');
         console.log('🟢 Step 4: HTML Path:', htmlPath);
         
         const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
         console.log('🟢 Step 5: File URL:', fileUrl);
         
         await driver.get(fileUrl);
         console.log('🟢 Step 6: Navigated to page');
         
         await driver.manage().window().maximize();
         console.log('🟢 Step 7: Window maximized');
         
         page = new FinanceTrackerPage(driver);
         overview = new FinancialOverview(driver);
         transcationlist = new TransactionList(driver);
         console.log('🟢 Step 8: Page object created');

        // Verify that page opened successfully.
        const HeaderPage = await waitFor(driver, By.css('.header h1'), TIMEOUT);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();
        console.log('🟢 Step 9: Verify that page opened successfully.');

        // Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('✅ Header assertion passed!\n');           
         
     } 
     catch (error)
     {
        console.log('\n🔴 ERROR:', error.message);
         throw error;
     }
     
     
 });

 after(async function () 
 {
    console.log('\n🔒 Closing browser...');
     await driver.quit();
 });


    /*****************************************************************************************************
    * Test ID        : TC-006
    * Test Case      : Negative Amount (Below Minimum Boundary)
    * Test Technique : Boundary Value Analysis — Below lower boundary (negative value)
    *
    * Description    : Verify that entering a negative amount is rejected, the error message
    *                  "Please enter a valid positive amount" is displayed, and no transaction
    *                  is added to the list.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter a negative value in the Amount field: -50.
    *                  4. Fill the remaining fields:
    *                       - Description : "test the negative amount"
    *                       - Type        : Income
    *                       - Category    : Salary
    *                  5. Click "Add Transaction".
    *                  6. Assert the transaction was NOT added to the list.
    *                  7. Assert the error message "Please enter a valid positive amount" is shown.
    *
    * Expected Result : Form is rejected. Error "Please enter a valid positive amount" is shown.
    *                   No transaction is added.
    *******************************************************************************************************/
    it('TC-006: Negative Amount — Below Minimum Boundary', async function ()
    {
        console.log('🔎 TC-006: Negative Amount — Below Minimum Boundary');

        let index = 0;

        // Step 3 & 4: Fill all fields with a negative amount
        await page.fillDescription('test the negative amount');
        await page.fillAmount(-50);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Assert the transaction was NOT added (description "a" should not appear)
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.description).not.equal('test the negative amount');
        console.log('✅ Negative amount correctly rejected, transaction not added');

        // Step 7: Assert the amount error message is displayed
        const amountError = await (await waitFor(driver, By.id('amountError'), SLEEP_LONG)).getText();
        expect(amountError).to.equal('Please enter a valid positive amount');
        console.log('✅ Amount error message displayed correctly:', amountError);
    }); 


    /*****************************************************************************************************
    * Test ID        : TC-007
    * Test Case      : Minimum Valid Amount (0.01)
    * Test Technique : Boundary Value Analysis — Lower boundary (min = 0.01)
    *
    * Description    : Verify that the minimum valid amount (0.01) is accepted and the transaction
    *                  appears correctly in the transaction list.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter the minimum valid amount in the Amount field: 0.01.
    *                  4. Fill the remaining fields:
    *                       - Description : "this for testing"
    *                       - Type        : Income
    *                       - Category    : Salary
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction shows the amount $0.01.
    *
    * Expected Result : Transaction is accepted and $0.01 is displayed in the transaction list.
    *******************************************************************************************************/
    it('TC-007: Minimum Valid Amount (0.01)', async function ()
    {
        console.log('🔎 TC-007: Minimum Valid Amount (0.01)');

        let index = 0;

        // Step 3 & 4: Fill all fields with the minimum valid amount
        await page.fillDescription('this for testing');
        await page.fillAmount(0.01);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Verify the newest transaction shows amount $0.01
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.amount).to.equal('$ 0.01');
        console.log('✅ Minimum amount (0.01) accepted, assertion passed');

    });     


    /*****************************************************************************************************
    * Test ID        : TC-008
    * Test Case      : Maximum Valid Amount (999,999.99)
    * Test Technique : Boundary Value Analysis — Upper boundary (max = 999,999.99)
    *
    * Description    : Verify that the maximum valid amount (999,999.99) is accepted and the
    *                  transaction appears correctly in the transaction list.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter the maximum valid amount in the Amount field: 999999.99.
    *                  4. Fill the remaining fields:
    *                       - Description : "hello world"
    *                       - Type        : Income
    *                       - Category    : Salary
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction shows the amount $999,999.99.
    *
    * Expected Result : Transaction is accepted and $999,999.99 is displayed in the list.
    *******************************************************************************************************/
    it('TC-008: Maximum Valid Amount (999,999.99)', async function ()
    {
        console.log('🔎 TC-008: Maximum Valid Amount (999,999.99)');

        let index = 0;

        // Step 3 & 4: Fill all fields with the maximum valid amount
        await page.fillDescription('hello world');
        await page.fillAmount(999999.99);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Verify the newest transaction shows amount $999,999.99
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.amount).to.equal('$ 999999.99');
        console.log('✅ Maximum amount (999,999.99) accepted, assertion passed');

    }); 

// ⚠️ BUG FOUND: The application accepts 1,000,000.00 which exceeds the specified maximum of 999,999.99.
    /*****************************************************************************************************
    * Test ID        : TC-009
    * Test Case      : Amount Exceeds Maximum (1,000,000.00) — Bug Identified
    * Test Technique : Boundary Value Analysis — Just above upper boundary (max+0.01)
    *
    * Description    : Verify that an amount of 1,000,000.00 (above the maximum of 999,999.99) is
    *                  rejected. NOTE: A bug was found — the application currently accepts this value.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter an amount above the maximum: 1000000.00.
    *                  4. Fill the remaining fields:
    *                       - Description : "hello"
    *                       - Type        : Income
    *                       - Category    : Salary
    *                  5. Click "Add Transaction".
    *                  6. Assert the transaction was NOT added to the list.
    *                  7. Assert the error message "Amount seems too large" is shown.
    *
    * Expected Result : Form is rejected. Error "Amount seems too large" is displayed.
    *                   No transaction is added.
    * Actual Result   : ❌ BUG — Application accepts 1,000,000.00 and adds the transaction.
    *******************************************************************************************************/
    it('TC-009: Amount Exceeds Maximum (1,000,000.00) — Bug Identified', async function ()
    {
        console.log('🔎 TC-009: Amount Exceeds Maximum (1,000,000.00) — Bug Identified');

        let index = 0;

        // Step 3 & 4: Fill all fields with an amount above the allowed maximum
        await page.fillDescription('hello');
        await page.fillAmount(1000000.00);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Assert the transaction was NOT added
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.amount).not.equal('$ 1000000.00');
        console.log('✅ Amount above maximum correctly rejected, transaction not added');

        // Step 7: Assert the amount error message is displayed
        const amountError = await (await waitFor(driver, By.id('amountError'), SLEEP_LONG)).getText();
        expect(amountError).to.equal('Amount seems too large');
        console.log('✅ Amount error message displayed correctly:', amountError);        
    }); 


    /*****************************************************************************************************
    * Test ID        : TC-010
    * Test Case      : Amount with Three Decimal Places (5.001) — Invalid Step
    * Test Technique : Equivalence Partitioning — Invalid partition (precision beyond 2 decimal places)
    *
    * Description    : Verify that an amount with three decimal places (5.001) is rejected by the
    *                  browser's native step validation, since the field only allows 0.01 increments.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter an amount with 3 decimal places: 5.001.
    *                  4. Fill the remaining fields:
    *                       - Description : "test"
    *                       - Type        : Income
    *                       - Category    : Salary
    *                  5. Click "Add Transaction".
    *                  6. Assert the transaction was NOT added (amount 5.001 not in list).
    *                  7. Assert the Amount field validity state is invalid.
    *
    * Expected Result : Browser rejects the value with a native step-mismatch error.
    *                   No transaction is added.
    *******************************************************************************************************/
    it('TC-010: Amount with Three Decimal Places (5.001) — Invalid Step', async function ()
    {
        console.log('🔎 TC-010: Amount with Three Decimal Places (5.001) — Invalid Step');

        let index = 0;

        // Step 3 & 4: Fill all fields with a 3-decimal-place amount
        await page.fillDescription('test');
        await page.fillAmount(5.001);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 5: Click Add Transaction (TC-010 body - step 5)
        await page.addTransaction();

        // Step 6: Assert the transaction was NOT added
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.amount).not.equal('$ 5.001');
        console.log('✅ Three-decimal amount correctly rejected, transaction not added');

        // Step 7: Assert the Amount field is invalid (browser native step validation)
        const isValid = await driver.executeScript(`return document.getElementById('amount').validity.valid;`);
        assert.equal(isValid, false, 'Amount field should be invalid with 3-decimal step mismatch');
        console.log('✅ Amount field correctly invalid for 3-decimal-place input, assertion passed');    
    });     


    /*****************************************************************************************************
    * Test ID        : TC-011
    * Test Case      : Empty Amount Field
    * Test Technique : Equivalence Partitioning — Invalid partition (empty/missing required field)
    *
    * Description    : Verify that submitting the form with an empty Amount field is rejected by
    *                  the browser's native required-field validation and no transaction is added.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Leave the Amount field empty.
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Type        : Income
    *                       - Category    : Salary
    *                  5. Click "Add Transaction".
    *                  6. Assert the transaction was NOT added to the list.
    *                  7. Assert the Amount field's validity state is invalid.
    *
    * Expected Result : Browser displays "Please fill out this field." No transaction is added.
    *******************************************************************************************************/
    it('TC-011: Empty Amount Field', async function ()
    {
        console.log('🔎 TC-011: Empty Amount Field');

        let index = 0;

        // Step 3 & 4: Fill all required fields except Amount
        await page.fillDescription('a');
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Assert the transaction was NOT added
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.description).not.equal('a');
        console.log('✅ Empty amount correctly rejected, transaction not added');

        // Step 7: Assert the Amount field is flagged as invalid by the browser
        const isValid = await driver.executeScript(`return document.getElementById('amount').validity.valid;`);
        assert.equal(isValid, false, 'Amount field should be invalid when empty');
        console.log('✅ Amount field correctly invalid when empty, assertion passed');    
    });        




});



/*============================================================================================================================================== *
 *                                                   Test Suite for Type Field                                                                    *
 *===============================================================================================================================================*/

   describe('Type Field Test Suite', function () 
   {
 let driver;
 let page;
 let overview;

 before(async function () 
 { 
    console.log('\n🟢 Step 1: beforeEach started');
     
     try {
         console.log('🟢 Step 2: About to create driver...');
         
         driver = await createDriver();
         
         console.log('🟢 Step 3: Driver created successfully!');
         
         const htmlPath = path.join(__dirname, '..', '..', 'App', 'finance_tracker_app.html');
         console.log('🟢 Step 4: HTML Path:', htmlPath);
         
         const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
         console.log('🟢 Step 5: File URL:', fileUrl);
         
         await driver.get(fileUrl);
         console.log('🟢 Step 6: Navigated to page');
         
         await driver.manage().window().maximize();
         console.log('🟢 Step 7: Window maximized');
         
         page = new FinanceTrackerPage(driver);
         overview = new FinancialOverview(driver);
         transcationlist = new TransactionList(driver);
         console.log('🟢 Step 8: Page object created');

        // Verify that page opened successfully.
        const HeaderPage = await waitFor(driver, By.css('.header h1'), TIMEOUT);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();
        console.log('🟢 Step 9: Verify that page opened successfully.');

        // Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('✅ Header assertion passed!\n');           
         
     } 
     catch (error)
     {
        console.log('\n🔴 ERROR:', error.message);
         throw error;
     }
     
     
 });

 after(async function () 
 {
    console.log('\n🔒 Closing browser...');
     await driver.quit();
 });



    /*****************************************************************************************************
    * Test ID        : TC-012
    * Test Case      : Empty Type Field
    * Test Technique : Equivalence Partitioning — Invalid partition (no selection)
    *
    * Description    : Verify that submitting the form without selecting a transaction type is
    *                  rejected by the browser's native required-field validation and no transaction
    *                  is added.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Leave the Type dropdown at its default (no selection).
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Category    : Salary
    *                  5. Click "Add Transaction".
    *                  6. Assert the transaction was NOT added to the list.
    *                  7. Assert the Type field's validity state is invalid.
    *
    * Expected Result : Browser displays "Please select an item in the list." No transaction added.
    *******************************************************************************************************/
    it('TC-012: Empty Type Field', async function ()
    {
        console.log('🔎 TC-012: Empty Type Field');

        let index = 0;

        // Step 3 & 4: Fill all required fields except Type
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectCategory('Salary');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Assert the transaction was NOT added
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.description).not.equal('a');
        console.log('✅ Empty type correctly rejected, transaction not added');

        // Step 7: Assert the Type field is flagged as invalid by the browser
        const isValid = await driver.executeScript(`return document.getElementById('type').validity.valid;`);
        assert.equal(isValid, false, 'Type field should be invalid when no selection is made');
        console.log('✅ Type field correctly invalid when no selection made, assertion passed');    
    });    




    /*****************************************************************************************************
    * Test ID        : TC-013
    * Test Case      : Income Transaction Type
    * Test Technique : Equivalence Partitioning — Valid partition (income type)
    *
    * Description    : Verify that selecting "income" as the transaction type results in the
    *                  transaction being added, the balance increasing, and the total income
    *                  increasing by the entered amount.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Select "income" as the Type.
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Category    : Salary
    *                  5. Record balance and total income before submission.
    *                  6. Click "Add Transaction".
    *                  7. Verify the newest transaction has type "income" and correct values.
    *                  8. Verify balance increased by $100.
    *                  9. Verify total income increased by $100.
    *
    * Expected Result : Transaction added as income. Balance and Total Income each increase by $100.
    *******************************************************************************************************/
    it('TC-013: Income Transaction Type', async function ()
    {
        console.log('🔎 TC-013: Income Transaction Type');

        let index = 0;

        // Step 3 & 4: Fill all fields with income type
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Record financials before submission
        let balanceBefore = await overview.getBalance();
        let incomeBefore = await overview.getIncome();
        console.log('\nBalance before submit = $', balanceBefore);
        console.log('Total income before submit = $', incomeBefore, '\n');       

        // Step 6: Click Add Transaction
        await page.addTransaction();

        // Step 7: Verify the newest transaction data
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('a');
        expect(lastTransaction.amount).to.equal('$ 100');
        expect(lastTransaction.type.toLowerCase()).to.equal('income');
        expect(lastTransaction.categoryValue.toLowerCase()).to.equal('salary');
        console.log('✅ Transaction data (income type) assertion passed');

        // Step 8: Verify balance increased by $100
        let balanceAfter = await overview.getBalance();
        console.log('Balance before submit = $', balanceBefore);
        console.log('Balance after submit = $', balanceAfter);
        expect(balanceAfter - balanceBefore).to.equal(100);
        console.log('✅ Balance increased by $100, assertion passed');

        // Step 9: Verify total income increased by $100
        let incomeAfter = await overview.getIncome();
        console.log('Total income before submit = $', incomeBefore);
        console.log('Total income after submit = $', incomeAfter);
        expect(incomeAfter - incomeBefore).to.equal(100);
        console.log('✅ Total income increased by $100, assertion passed');  
    });     


    /*****************************************************************************************************
    * Test ID        : TC-014
    * Test Case      : Expense Transaction Type
    * Test Technique : Equivalence Partitioning — Valid partition (expense type)
    *
    * Description    : Verify that selecting "expense" as the transaction type results in the
    *                  transaction being added, the balance decreasing, and the total expenses
    *                  increasing by the entered amount.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Select "expense" as the Type.
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Category    : Salary
    *                  5. Record balance and total expenses before submission.
    *                  6. Click "Add Transaction".
    *                  7. Verify the newest transaction has type "expense" and shows negative amount.
    *                  8. Verify balance decreased by $100.
    *                  9. Verify total expenses increased by $100.
    *
    * Expected Result : Transaction added as expense. Balance decreases and Total Expenses increases by $100.
    *******************************************************************************************************/
    it('TC-014: Expense Transaction Type', async function ()
    {
        console.log('🔎 TC-014: Expense Transaction Type');

        let index = 0;

        // Step 3 & 4: Fill all fields with expense type
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('expense');
        await page.selectCategory('Salary');

        // Step 5: Record financials before submission
        let balanceBefore = await overview.getBalance();
        let expensesBefore = await overview.getExpenses();
        console.log('\nBalance before submit = $', balanceBefore);
        console.log('Total expenses before submit = $', expensesBefore, '\n');       

        // Step 6: Click Add Transaction
        await page.addTransaction();

        // Step 7: Verify the newest transaction data
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('a');
        expect(lastTransaction.amount).to.equal('$ -100');
        expect(lastTransaction.type.toLowerCase()).to.equal('expense');
        expect(lastTransaction.categoryValue.toLowerCase()).to.equal('salary');
        console.log('✅ Transaction data (expense type) assertion passed');

        // Step 8: Verify balance decreased by $100
        let balanceAfter = await overview.getBalance();
        console.log('Balance before submit = $', balanceBefore);
        console.log('Balance after submit = $', balanceAfter);
        expect(balanceBefore - balanceAfter).to.equal(100);
        console.log('✅ Balance decreased by $100, assertion passed');

        // Step 9: Verify total expenses increased by $100
        let expensesAfter = await overview.getExpenses();
        console.log('Total expenses before submit = $', expensesBefore);
        console.log('Total expenses after submit = $', expensesAfter);
        expect(expensesAfter - expensesBefore).to.equal(100);
        console.log('✅ Total expenses increased by $100, assertion passed');  
    });  







});




/*============================================================================================================================================== *
 *                                                   Test Suite for Category Field                                                             *
 *===============================================================================================================================================*/

   describe('Category Field Test Suite', function () 
   {
 let driver;
 let page;
 let overview;

 before(async function () 
 { 
    console.log('\n🟢 Step 1: beforeEach started');
     
     try {
         console.log('🟢 Step 2: About to create driver...');
         
         driver = await createDriver();
         
         console.log('🟢 Step 3: Driver created successfully!');
         
         const htmlPath = path.join(__dirname, '..', '..', 'App', 'finance_tracker_app.html');
         console.log('🟢 Step 4: HTML Path:', htmlPath);
         
         const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
         console.log('🟢 Step 5: File URL:', fileUrl);
         
         await driver.get(fileUrl);
         console.log('🟢 Step 6: Navigated to page');
         
         await driver.manage().window().maximize();
         console.log('🟢 Step 7: Window maximized');
         
         page = new FinanceTrackerPage(driver);
         overview = new FinancialOverview(driver);
         transcationlist = new TransactionList(driver);
         console.log('🟢 Step 8: Page object created');

        // Verify that page opened successfully.
        const HeaderPage = await waitFor(driver, By.css('.header h1'), TIMEOUT);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();
        console.log('🟢 Step 9: Verify that page opened successfully.');

        // Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('✅ Header assertion passed!\n');           
         
     } 
     catch (error)
     {
        console.log('\n🔴 ERROR:', error.message);
         throw error;
     }
     
     
 });

 after(async function () 
 {
    console.log('\n🔒 Closing browser...');
     await driver.quit();
 });



    /*****************************************************************************************************
    * Test ID        : TC-015
    * Test Case      : Category Field Left Empty (Optional Field)
    * Test Technique : Equivalence Partitioning — Valid partition (optional field left blank)
    *
    * Description    : Verify that leaving the optional Category field empty is allowed and the
    *                  transaction is added with "No category" displayed.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Leave the Category dropdown at its default (no selection).
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Type        : Income
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction shows "No category" for the category value.
    *
    * Expected Result : Transaction is accepted and displays "No category" in the transaction list.
    *******************************************************************************************************/
    it('TC-015: Category Field Empty (Optional Field)', async function ()
    {
        console.log('🔎 TC-015: Category Field Empty (Optional Field)');

        let index = 0;

        // Step 3 & 4: Fill all required fields, leave Category empty
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('income');  

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Verify the newest transaction shows "No category"
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('a');
        expect(lastTransaction.amount).to.equal('$ 100');
        expect(lastTransaction.type.toLowerCase()).to.equal('income');
        expect(lastTransaction.categoryValue.toLowerCase()).to.equal('no category');
        console.log('✅ Empty category correctly shows "No category", assertion passed');

    });  


    /*****************************************************************************************************
    * Test ID        : TC-016
    * Test Case      : Category with Special Character (Bills & Utilities)
    * Test Technique : Equivalence Partitioning — Valid partition (category name with special character &)
    *
    * Description    : Verify that a category whose display name contains the special character "&"
    *                  (Bills & Utilities) is stored and displayed correctly.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Select "Bills & Utilities" from the Category dropdown.
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Type        : Income
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction shows category display "Bills & Utilities"
    *                     and internal value "bills".
    *
    * Expected Result : Transaction is accepted and "Bills & Utilities" is displayed correctly.
    *******************************************************************************************************/
    it('TC-016: Category with Special Character (Bills & Utilities)', async function ()
    {
        console.log('🔎 TC-016: Category with Special Character (Bills & Utilities)');

        let index = 0;

        // Step 3 & 4: Fill all fields, selecting the "Bills & Utilities" category
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('income'); 
        await page.selectCategory('Bills & Utilities');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Verify the newest transaction shows the correct category
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('a');
        expect(lastTransaction.amount).to.equal('$ 100');
        expect(lastTransaction.type.toLowerCase()).to.equal('income');
        expect(lastTransaction.categoryDisplay.toLowerCase()).to.equal('bills & utilities');
        expect(lastTransaction.categoryValue.toLowerCase()).to.equal('bills');
        console.log('✅ Category "Bills & Utilities" (with special char) stored correctly, assertion passed');

    });  


});



/*============================================================================================================================================== *
 *                                                   Test Suite for Date Field                                                             *
 *===============================================================================================================================================*/

   describe('Date Field Test Suite', function () 
   {
 let driver;
 let page;
 let overview;

 before(async function () 
 { 
    console.log('\n🟢 Step 1: beforeEach started');
     
     try {
         console.log('🟢 Step 2: About to create driver...');
         
         driver = await createDriver();
         
         console.log('🟢 Step 3: Driver created successfully!');
         
         const htmlPath = path.join(__dirname, '..', '..', 'App', 'finance_tracker_app.html');
         console.log('🟢 Step 4: HTML Path:', htmlPath);
         
         const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
         console.log('🟢 Step 5: File URL:', fileUrl);
         
         await driver.get(fileUrl);
         console.log('🟢 Step 6: Navigated to page');
         
         await driver.manage().window().maximize();
         console.log('🟢 Step 7: Window maximized');
         
         page = new FinanceTrackerPage(driver);
         overview = new FinancialOverview(driver);
         transcationlist = new TransactionList(driver);
         console.log('🟢 Step 8: Page object created');

        // Verify that page opened successfully.
        const HeaderPage = await waitFor(driver, By.css('.header h1'), TIMEOUT);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();
        console.log('🟢 Step 9: Verify that page opened successfully.');

        // Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('✅ Header assertion passed!\n');           
         
     } 
     catch (error)
     {
        console.log('\n🔴 ERROR:', error.message);
         throw error;
     }
     
     
 });

 after(async function () 
 {
    console.log('\n🔒 Closing browser...');
     await driver.quit();
 });


    /*****************************************************************************************************
    * Test ID        : TC-017
    * Test Case      : Transaction with a Past Date
    * Test Technique : Equivalence Partitioning — Valid partition (historical date within allowed range)
    *
    * Description    : Verify that selecting a past date within the valid range (1900–2099) is
    *                  accepted and stored correctly with the transaction.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Select a past date: "2024-01-15".
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Type        : Income
    *                       - Category    : Bills & Utilities
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction shows date "2024-01-15".
    *
    * Expected Result : Transaction is accepted and the date "2024-01-15" is stored and displayed.
    *******************************************************************************************************/
    it('TC-017: Transaction with a Past Date', async function ()
    {
        console.log('🔎 TC-017: Transaction with a Past Date');

        let index = 0;

        // Step 3 & 4: Fill all fields with a past date
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('income'); 
        await page.selectCategory('Bills & Utilities');
        await page.selectDate('2024-01-15');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Verify the newest transaction shows the past date
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.date).to.equal('2024-01-15');
        console.log('✅ Past date (2024-01-15) accepted and stored correctly, assertion passed');

    }); 


    /*****************************************************************************************************
    * Test ID        : TC-018
    * Test Case      : Date Field Uses Default (Today)
    * Test Technique : Equivalence Partitioning — Valid partition (optional field uses default)
    *
    * Description    : Verify that when no date is selected, the transaction date defaults to
    *                  today's date and is stored correctly.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Do not change the date field (leave at its default).
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Type        : Expense
    *                       - Category    : Shopping
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction shows today's date.
    *
    * Expected Result : Transaction is accepted and the date matches today (YYYY-MM-DD).
    *******************************************************************************************************/
    it('TC-018: Date Field Uses Default (Today)', async function ()
    {
        console.log('🔎 TC-018: Date Field Uses Default (Today)');

        let index = 0;

        // Step 3 & 4: Fill all required fields, do not change the date
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('expense'); 
        await page.selectCategory('shopping');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Verify the newest transaction shows today's date
        const today = new Date().toISOString().split('T')[0];
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.date).to.equal(today);
        console.log('✅ Default date (today) correctly applied:', today);

    }); 



    /*****************************************************************************************************
    * Test ID        : TC-019
    * Test Case      : Minimum Valid Date (1900-01-01)
    * Test Technique : Boundary Value Analysis — Lower boundary (min date = 1900-01-01)
    *
    * Description    : Verify that the minimum allowed date (1900-01-01) is accepted and stored
    *                  correctly with the transaction.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter the minimum valid date: "1900-01-01".
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Type        : Expense
    *                       - Category    : Shopping
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction shows date "1900-01-01".
    *
    * Expected Result : Transaction is accepted and date "1900-01-01" is stored correctly.
    *******************************************************************************************************/
    it('TC-019: Minimum Valid Date (1900-01-01)', async function ()
    {
        console.log('🔎 TC-019: Minimum Valid Date (1900-01-01)');

        let index = 0;

        // Step 3 & 4: Fill all fields with the minimum valid date
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('expense'); 
        await page.selectCategory('shopping');
        await page.selectDate('1900-01-01');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Verify the newest transaction shows the minimum date
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.date).to.equal('1900-01-01');
        console.log('✅ Minimum date (1900-01-01) accepted and stored correctly, assertion passed');

    });
    


    /*****************************************************************************************************
    * Test ID        : TC-020
    * Test Case      : Maximum Valid Date (2099-12-31)
    * Test Technique : Boundary Value Analysis — Upper boundary (max date = 2099-12-31)
    *
    * Description    : Verify that the maximum allowed date (2099-12-31) is accepted and stored
    *                  correctly with the transaction.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter the maximum valid date: "2099-12-31".
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Type        : Expense
    *                       - Category    : Transportation
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction shows date "2099-12-31".
    *
    * Expected Result : Transaction is accepted and date "2099-12-31" is stored correctly.
    *******************************************************************************************************/
    it('TC-020: Maximum Valid Date (2099-12-31)', async function ()
    {
        console.log('🔎 TC-020: Maximum Valid Date (2099-12-31)');

        let index = 0;

        // Step 3 & 4: Fill all fields with the maximum valid date
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('expense'); 
        await page.selectCategory('transport');
        await page.selectDate('2099-12-31');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Verify the newest transaction shows the maximum date
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.date).to.equal('2099-12-31');
        console.log('✅ Maximum date (2099-12-31) accepted and stored correctly, assertion passed');

    });     


// ⚠️ BUG FOUND: Date "1899-12-31" (below minimum boundary) was accepted and added to the transaction list.
    /*****************************************************************************************************
    * Test ID        : TC-021
    * Test Case      : Date Below Minimum Boundary (1899-12-31) — Bug Identified
    * Test Technique : Boundary Value Analysis — Just below lower boundary (min−1 day)
    *
    * Description    : Verify that a date of "1899-12-31" (one day before the minimum of 1900-01-01)
    *                  is rejected. NOTE: A bug was found — the application currently accepts this date.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter a date below the minimum: "1899-12-31".
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Type        : Expense
    *                       - Category    : Shopping
    *                  5. Click "Add Transaction".
    *                  6. Assert the transaction was NOT added with date "1899-12-31".
    *
    * Expected Result : Transaction is rejected. Date "1899-12-31" should not appear in the list.
    * Actual Result   : ❌ BUG — Application accepts date "1899-12-31" and adds the transaction.
    *******************************************************************************************************/
    it('TC-021: Date Below Minimum Boundary (1899-12-31) — Bug Identified', async function ()
    {
        console.log('🔎 TC-021: Date Below Minimum Boundary (1899-12-31) — Bug Identified');

        let index = 0;

        // Step 3 & 4: Fill all fields with a date below the valid minimum
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('expense'); 
        await page.selectCategory('shopping');
        await page.selectDate('1899-12-31');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Assert the transaction was NOT added with the below-minimum date
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.date).not.equal('1899-12-31');
        console.log('✅ Date below minimum boundary correctly rejected, assertion passed');

    });    


// ⚠️ BUG FOUND: Date "2100-01-01" (above maximum boundary) was accepted and added to the transaction list.
    /*****************************************************************************************************
    * Test ID        : TC-022
    * Test Case      : Date Above Maximum Boundary (2100-01-01) — Bug Identified
    * Test Technique : Boundary Value Analysis — Just above upper boundary (max+1 day)
    *
    * Description    : Verify that a date of "2100-01-01" (one day after the maximum of 2099-12-31)
    *                  is rejected. NOTE: A bug was found — the application currently accepts this date.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter a date above the maximum: "2100-01-01".
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Type        : Expense
    *                       - Category    : Shopping
    *                  5. Click "Add Transaction".
    *                  6. Assert the transaction was NOT added with date "2100-01-01".
    *
    * Expected Result : Transaction is rejected. Date "2100-01-01" should not appear in the list.
    * Actual Result   : ❌ BUG — Application accepts date "2100-01-01" and adds the transaction.
    *******************************************************************************************************/
    it('TC-022: Date Above Maximum Boundary (2100-01-01) — Bug Identified', async function ()
    {
        console.log('🔎 TC-022: Date Above Maximum Boundary (2100-01-01) — Bug Identified');

        let index = 0;

        // Step 3 & 4: Fill all fields with a date above the valid maximum
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('expense'); 
        await page.selectCategory('shopping');
        await page.selectDate('2100-01-01');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Assert the transaction was NOT added with the above-maximum date
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.date).not.equal('2100-01-01');
        console.log('✅ Date above maximum boundary correctly rejected, assertion passed');

    });     




});




/*============================================================================================================================================== *
 *                                                   Test Suite for Note Field                                                                    *
 *===============================================================================================================================================*/

   describe('Note Field Test Suite', function () 
   {
 let driver;
 let page;
 let overview;

 before(async function () 
 { 
    console.log('\n🟢 Step 1: beforeEach started');
     
     try {
         console.log('🟢 Step 2: About to create driver...');
         
         driver = await createDriver();
         
         console.log('🟢 Step 3: Driver created successfully!');
         
         const htmlPath = path.join(__dirname, '..', '..', 'App', 'finance_tracker_app.html');
         console.log('🟢 Step 4: HTML Path:', htmlPath);
         
         const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
         console.log('🟢 Step 5: File URL:', fileUrl);
         
         await driver.get(fileUrl);
         console.log('🟢 Step 6: Navigated to page');
         
         await driver.manage().window().maximize();
         console.log('🟢 Step 7: Window maximized');
         
         page = new FinanceTrackerPage(driver);
         overview = new FinancialOverview(driver);
         transcationlist = new TransactionList(driver);
         console.log('🟢 Step 8: Page object created');

        // Verify that page opened successfully.
        const HeaderPage = await waitFor(driver, By.css('.header h1'), TIMEOUT);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();
        console.log('🟢 Step 9: Verify that page opened successfully.');

        // Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('✅ Header assertion passed!\n');         
         
     } 
     catch (error)
     {
        console.log('\n🔴 ERROR:', error.message);
         throw error;
     }
     
     
 });

 after(async function () 
 {
    console.log('\n🔒 Closing browser...');
     await driver.quit();
 });



    /*****************************************************************************************************
    * Test ID        : TC-023
    * Test Case      : Note Field — Minimum Length (1 Character)
    * Test Technique : Boundary Value Analysis — Lower boundary (min = 1 character)
    *
    * Description    : Verify that a note containing exactly 1 character is accepted and stored
    *                  correctly with the transaction.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter exactly 1 character in the Notes field: "b".
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Type        : Expense
    *                       - Category    : Shopping
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction shows note "b".
    *
    * Expected Result : Transaction is accepted and note "b" is stored and displayed correctly.
    *******************************************************************************************************/
    it('TC-023: Note Field — Minimum Length (1 Character)', async function ()
    {
        console.log('🔎 TC-023: Note Field — Minimum Length (1 Character)');

        let index = 0;

        // Step 3 & 4: Fill all fields with a 1-character note
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('expense'); 
        await page.selectCategory('shopping');
        await page.fillNotes('b');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Verify the newest transaction shows note "b"
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.note).to.equal('b');
        console.log('✅ Minimum length (1 character) note accepted and stored correctly, assertion passed');

    });     



    /*****************************************************************************************************
    * Test ID        : TC-024
    * Test Case      : Note Field — Maximum Length (200 Characters)
    * Test Technique : Boundary Value Analysis — Upper boundary (max = 200 characters)
    *
    * Description    : Verify that a note of exactly 200 characters (the maximum allowed) is
    *                  accepted and stored completely without truncation.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter exactly 200 characters in the Notes field.
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Type        : Expense
    *                       - Category    : Shopping
    *                  5. Click "Add Transaction".
    *                  6. Verify the newest transaction shows the full 200-character note.
    *
    * Expected Result : Transaction is accepted and the full 200-character note is stored without truncation.
    *******************************************************************************************************/
    it('TC-024: Note Field — Maximum Length (200 Characters)', async function ()
    {
        console.log('🔎 TC-024: Note Field — Maximum Length (200 Characters)');

        let index = 0;

        // Step 3 & 4: Fill all fields with exactly 200-character note
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('expense'); 
        await page.selectCategory('shopping');
        await page.fillNotes('lbrpyxuiobnrcgjffsihvnsvclpaykhixoafasxgfktdzdotadliuqokwibwjvgnynizaexvbgbglglpjeuphsurimofanekpxpekbnbzpiktkrabtlbrpkdjwbazczrkwxrjypxqfwnboxpsvlbbulgdtzreigqaqfnwjerhtdxlmuxfltnkpjkbvcalarlsoehoits');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Verify the newest transaction shows the full 200-character note
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.note).to.equal('lbrpyxuiobnrcgjffsihvnsvclpaykhixoafasxgfktdzdotadliuqokwibwjvgnynizaexvbgbglglpjeuphsurimofanekpxpekbnbzpiktkrabtlbrpkdjwbazczrkwxrjypxqfwnboxpsvlbbulgdtzreigqaqfnwjerhtdxlmuxfltnkpjkbvcalarlsoehoits');
        console.log('✅ Maximum length (200 characters) note accepted and stored correctly, assertion passed');

    }); 


// ⚠️ BUG FOUND: Notes with 201+ characters are accepted and added to the transaction list.
// ⚠️ UI BUG: When note text is too long, it breaks the layout — Delete button is pushed off-screen.
    /*****************************************************************************************************
    * Test ID        : TC-025
    * Test Case      : Note Field Exceeds Maximum Length (201 Characters) — Bug Identified
    * Test Technique : Boundary Value Analysis — Just above upper boundary (max+1 = 201 characters)
    *
    * Description    : Verify that a note of 201 characters (above the maximum of 200) is rejected.
    *                  NOTE: A bug was found — the application currently accepts this value.
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Enter exactly 201 characters in the Notes field.
    *                  4. Fill the remaining fields:
    *                       - Description : "a"
    *                       - Amount      : 100
    *                       - Type        : Expense
    *                       - Category    : Shopping
    *                  5. Click "Add Transaction".
    *                  6. Assert the transaction was NOT added with the 201-character note.
    *
    * Expected Result : Transaction is rejected. 201-character note should not be stored.
    * Actual Result   : ❌ BUG — Application accepts 201-character notes and adds the transaction.
    *******************************************************************************************************/
    it('TC-025: Note Field Exceeds Maximum Length (201 Characters) — Bug Identified', async function ()
    {
        console.log('🔎 TC-025: Note Field Exceeds Maximum Length (201 Characters) — Bug Identified');

        let index = 0;

        // Step 3 & 4: Fill all fields with a 201-character note (above the allowed maximum)
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('expense'); 
        await page.selectCategory('shopping');
        await page.fillNotes('albrpyxuiobnrcgjffsihvnsvclpaykhixoafasxgfktdzdotadliuqokwibwjvgnynizaexvbgbglglpjeuphsurimofanekpxpekbnbzpiktkrabtlbrpkdjwbazczrkwxrjypxqfwnboxpsvlbbulgdtzreigqaqfnwjerhtdxlmuxfltnkpjkbvcalarlsoehoits');

        // Step 5: Click Add Transaction
        await page.addTransaction();

        // Step 6: Assert the transaction was NOT added with the over-limit note
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        expect(lastTransaction.note).not.equal('albrpyxuiobnrcgjffsihvnsvclpaykhixoafasxgfktdzdotadliuqokwibwjvgnynizaexvbgbglglpjeuphsurimofanekpxpekbnbzpiktkrabtlbrpkdjwbazczrkwxrjypxqfwnboxpsvlbbulgdtzreigqaqfnwjerhtdxlmuxfltnkpjkbvcalarlsoehoits');
        console.log('✅ Over-limit (201 character) note correctly rejected, assertion passed');

    });     


});



/*============================================================================================================================================== *
 *                                                   Test Suite for Transaction List                                                              *
 *===============================================================================================================================================*/

   describe('Transaction List Test Suite', function () 
   {
 let driver;
 let page;
 let overview;

 before(async function () 
 { 
    console.log('\n🟢 Step 1: beforeEach started');
     
     try {
         console.log('🟢 Step 2: About to create driver...');
         
         driver = await createDriver();
         
         console.log('🟢 Step 3: Driver created successfully!');
         
         const htmlPath = path.join(__dirname, '..', '..', 'App', 'finance_tracker_app.html');
         console.log('🟢 Step 4: HTML Path:', htmlPath);
         
         const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
         console.log('🟢 Step 5: File URL:', fileUrl);
         
         await driver.get(fileUrl);
         console.log('🟢 Step 6: Navigated to page');
         
         await driver.manage().window().maximize();
         console.log('🟢 Step 7: Window maximized');
         
         page = new FinanceTrackerPage(driver);
         overview = new FinancialOverview(driver);
         transcationlist = new TransactionList(driver);
         console.log('🟢 Step 8: Page object created');

        // Verify that page opened successfully.
        const HeaderPage = await waitFor(driver, By.css('.header h1'), TIMEOUT);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();
        console.log('🟢 Step 9: Verify that page opened successfully.');

        // Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('✅ Header assertion passed!\n');         
         
     } 
     catch (error)
     {
        console.log('\n🔴 ERROR:', error.message);
         throw error;
     }
     
     
 });

 after(async function () 
 {
    console.log('\n🔒 Closing browser...');
     await driver.quit();
 });



    /*****************************************************************************************************
    * Test ID        : TC-026
    * Test Case      : Three Consecutive Transactions — Reverse Chronological Order Verification
    * Test Technique : Functional Testing — Transaction list ordering (newest first)
    *
    * Description    : Verify that when three transactions are added sequentially, they are displayed
    *                  in reverse chronological order in the transaction list (newest at the top,
    *                  oldest at the bottom).
    *
    * Test Procedure : 1. Navigate to the application.
    *                  2. Verify the page opened successfully (header check in beforeEach).
    *                  3. Add FIRST transaction:
    *                       - Description : "test for FIRST transaction"
    *                       - Amount      : 100
    *                       - Type        : Income
    *                       - Category    : Shopping
    *                       - Note        : "FIRST transaction"
    *                  4. Add SECOND transaction:
    *                       - Description : "test for SECOND transaction"
    *                       - Amount      : 500
    *                       - Type        : Income
    *                       - Category    : Salary
    *                       - Note        : "SECOND transaction"
    *                  5. Add THIRD transaction:
    *                       - Description : "test for THIRD transaction"
    *                       - Amount      : 100
    *                       - Type        : Expense
    *                       - Category    : Entertainment
    *                       - Note        : "THIRD transaction"
    *                  6. Verify THIRD transaction is at position 0 (top of list).
    *                  7. Verify SECOND transaction is at position 1 (middle of list).
    *                  8. Verify FIRST transaction is at position 2 (bottom of list).
    *
    * Expected Result : Transactions are displayed newest-first: THIRD at top, SECOND in middle,
    *                   FIRST at bottom.
    *******************************************************************************************************/
    it('TC-026: Three Consecutive Transactions — Reverse Chronological Order', async function ()
    {
        console.log('🔎 TC-026: Three Consecutive Transactions — Reverse Chronological Order');

        let index = 0;

        // Step 3: Add FIRST transaction
        await page.fillDescription('test for FIRST transaction');
        await page.fillAmount(100);
        await page.selectType('income'); 
        await page.selectCategory('shopping');
        await page.fillNotes('FIRST transaction');
        await page.addTransaction();

        // Step 4: Add SECOND transaction
        await page.fillDescription('test for SECOND transaction');
        await page.fillAmount(500);
        await page.selectType('income'); 
        await page.selectCategory('salary');
        await page.fillNotes('SECOND transaction');
        await page.addTransaction();

        // Step 5: Add THIRD transaction
        await page.fillDescription('test for THIRD transaction');
        await page.fillAmount(100);
        await page.selectType('expense'); 
        await page.selectCategory('Entertainment');
        await page.fillNotes('THIRD transaction');        
        await page.addTransaction();


        // Step 6: Verify THIRD transaction is at position 0 (top of list — newest)
        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('THIRD transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('test for THIRD transaction');
        expect(lastTransaction.amount).to.equal('$ -100');
        expect(lastTransaction.type.toLowerCase()).to.equal('expense');
        expect(lastTransaction.categoryDisplay.toLowerCase()).to.equal('entertainment');
        expect(lastTransaction.categoryValue.toLowerCase()).to.equal('entertainment');
        expect(lastTransaction.note).to.equal('THIRD transaction');
        console.log('✅ THIRD transaction correctly at position 0 (top), assertion passed');

        // Step 7: Verify SECOND transaction is at position 1 (middle)
        lastTransaction = await transcationlist.TransactionData(index + 1);
        console.log('SECOND transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('test for SECOND transaction');
        expect(lastTransaction.amount).to.equal('$ 500');
        expect(lastTransaction.type.toLowerCase()).to.equal('income');
        expect(lastTransaction.categoryDisplay.toLowerCase()).to.equal('salary');
        expect(lastTransaction.categoryValue.toLowerCase()).to.equal('salary');
        expect(lastTransaction.note).to.equal('SECOND transaction');
        console.log('✅ SECOND transaction correctly at position 1 (middle), assertion passed');
        
        // Step 8: Verify FIRST transaction is at position 2 (bottom — oldest)
        lastTransaction = await transcationlist.TransactionData(index + 2);
        console.log('FIRST transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('test for FIRST transaction');
        expect(lastTransaction.amount).to.equal('$ 100');
        expect(lastTransaction.type.toLowerCase()).to.equal('income');
        expect(lastTransaction.categoryDisplay.toLowerCase()).to.equal('shopping');
        expect(lastTransaction.categoryValue.toLowerCase()).to.equal('shopping');
        expect(lastTransaction.note).to.equal('FIRST transaction');
        console.log('✅ FIRST transaction correctly at position 2 (bottom), assertion passed');        

    });     


    /*****************************************************************************************************
     * Test ID        : TC-027
     * Test Case      : Delete Last Transaction
     * Test Technique : Functional Testing — Delete Operation Verification
     *
     * Description    : Verify that the most recent transaction can be successfully deleted from the
     *                  transaction list and that the deletion is reflected immediately.
     *
     * Test Procedure : 1. Navigate to the application.
     *                  2. Verify the page opened successfully (header check in beforeEach).
     *                  3. Create a new transaction with test data:
     *                       - Description : "delete me"
     *                       - Amount      : 100
     *                       - Type        : Income
     *                       - Category    : Healthcare
     *                  4. Click "Add Transaction".
     *                  5. Verify transaction appears in list (implicit in deleteTransaction).
     *                  6. Click the Delete button for the newest transaction (index 0).
     *                  7. Verify the transaction no longer appears in the list
     *                     (newest transaction should NOT have description "delete me").
     *
     * Expected Result : Transaction is successfully deleted and no longer appears in the transaction list.
     *                   The transaction that was previously second becomes the new first transaction.
     *******************************************************************************************************/
    it('TC-027: Delete Last Transcation.', async function ()
    {
        console.log('🔎 TC-027: Delete Last Transcation.');

        let index = 0;

        // Step 3 & 4: Fill all fields, selecting the "Bills & Utilities" category
        await page.fillDescription('delete me');
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('healthcare');

        const countBefore = await transcationlist.getTransactionCount();
        
        // Step 5: Click Add Transaction
        await page.addTransaction();

        const countAfterAdd = await transcationlist.getTransactionCount();
        expect(countAfterAdd).to.equal(countBefore + 1);

        // Step 6: Click Delete Button.
        await page.deleteTransaction(index);

        // Step 7: Verify the transaction got deleted.
        const countAfterDelete = await transcationlist.getTransactionCount();
        expect(countAfterDelete).to.equal(countBefore);

        let lastTransaction = await transcationlist.TransactionData(index);
        console.log('Latest transaction data:', lastTransaction);
        console.log('✅ Delete Last Transcation, assertion passed');

    });  





   });

   });













// ============================================
// LEGACY MANUAL TEST FUNCTION (archived)
// ============================================
// The manual testOpenApplication() function below was used during early
// development to verify that the page opened correctly. It is no longer
// needed because the same check is performed in every beforeEach hook above.
// It is retained here for reference only and is NOT executed by Mocha.

/*
async function testOpenApplication()
{
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        const htmlPath = path.join(__dirname, '..', '..', 'App', 'finance_tracker_app.html');
        const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
        await driver.get(fileUrl);
        await driver.manage().window().maximize();
        await driver.sleep(2000);
        const heading = await driver.findElement(By.css('h1')).getText();
        if (heading.includes('Personal Finance Tracker')) {
            console.log('✅ TEST PASSED: Application loaded correctly!');
        } else {
            console.log('❌ TEST FAILED: Unexpected heading:', heading);
        }
        await driver.sleep(3000);
    } catch (error) {
        console.error('❌ TEST FAILED WITH ERROR:', error.message);
    } finally {
        console.log('🔒 Closing browser...');
        await driver.quit();
    }
}
// testOpenApplication(); // Uncomment to run manually via: node Test.js
*/