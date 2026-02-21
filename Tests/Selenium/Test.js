// ============================================
// IMPORT REQUIRED MODULES
// ============================================

// selenium-webdriver: Main library for browser automation
// Builder: Creates a new browser driver instance
// By: Used to locate elements on the page (by ID, class, CSS, etc.)
// until: Provides wait conditions (wait until element appears, etc.)

//const { Builder, By, until, Select } = require('selenium-webdriver');

// Import the FinanceTrackerPage class. This is a page object model for the finance tracker app.

//const FinanceTrackerPage = require('./Pages/FinanceTrackerPage');
//const chrome = require('selenium-webdriver/chrome');

// path: Node.js built-in module for working with file paths
// Helps us build correct file paths regardless of operating system

//const path = require('path');

   // /* Comment for the package.json file:
   //  *  "test": "mocha Tests/Selenium/test/**/*.test.js --timeout 60000"
   //  *  (**) = I don't care how deep the file is and it can be in any folder, Search this folder AND ALL subfolders.
   //  *  (*.test.js) = but it MUST be a test file and the test file name must be test.js, Match files inside this folder only.
   //  */


   //const { Builder, By, until } = require('selenium-webdriver');
   //const chrome = require('selenium-webdriver/chrome');

   const { createDriver } = require('./Helper/Driver/driverHelper');
   const {FinanceTrackerPage, FinancialOverview, TransactionList } = require('./Helper/Pages/FinanceTrackerPage');
   const path = require('path');   
   const { expect, assert } = require('chai');
   const { By, until} = require('selenium-webdriver');

/*============================================================================================================================================== *
 *                                                   Test Suite for Description Field                                                             *
 *===============================================================================================================================================*/

   describe('Description Field Test Suite', function () 
   {
    let driver;
    let page;
    let overview;

    beforeEach(async function () 
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
            console.log('🟢 Step 8: Page object created\n');
            
        } catch (error)
        {
            console.log('');
            console.log('\n🔴 ERROR:', error.message);
            throw error;
        }
        
        
    });

    afterEach(async function () 
    {
        console.log('\n🔒 Closing browser...');
        await driver.quit();
    });

    
    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-001
    •⁠ ⁠Test Case : Empty Description Field
    *
    •⁠ ⁠Description:  Test when user forget to add description and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Leave Description Field empty. 
    *                   4. Fill other field with these data required for the test:
    *                        - Amount: 100.
    *                        - Type: Income.
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify error massage for Description Field.
    *                   7. Verify Balance amount doesn't changed.
    *
    * Expected Result : Error message displayed "Description is required" or pop up massage "please fill out this field."
    *******************************************************************************************************/
    it('TC-001: Empty Description Field', async function ()
    {
        console.log('🔎 TC-001: Empty Description Field:');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Store balance amount before cilck on add transaction button.
        let balanceBefore = await overview.getBalanceString();
        console.log('Balance amount before submmit= $',balanceBefore);

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify error massage for description field.
        // Method 1: Check if description field is valid according to browser
        const isValid = await driver.executeScript(`return document.getElementById('description').validity.valid;`);
        assert.equal(isValid, false, 'Description field should be invalid when empty');
        console.log('✅ Description field is invalid when empty assertion passed');

        // Step 7:
        // Method 2: verify by checking if balance change or not.
        let balanceAfter = await overview.getBalanceString();
        console.log('Balance amount after submmit= $',balanceAfter);
        expect(balanceAfter).to.equal(balanceBefore);
        console.log('✅ Balance remained assertion passed', balanceBefore);

        
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
    •⁠ ⁠Test ID : TC-002
    •⁠ ⁠Test Case : whitespace only at Description Field
    *
    •⁠ ⁠Description:  Test when user write whitespace only at description field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Write whitespace only description Field. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: ""
    *                        - Amount: 100.
    *                        - Type: Income.
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify error massage for Description Field.
    *                   7. Verify Balance amount doesn't changed.
    *
    * Expected Result : Error message displayed "Description is required"
    *******************************************************************************************************/
    it('TC-002: whitespace only at Description Field', async function ()
    {
        console.log('🔎 TC-002: whitespace only at Description Field:');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription(' ');
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Store balance amount before cilck on add transaction button.
        let balanceBefore = await overview.getBalanceString();
        console.log('Balance amount before submmit= $',balanceBefore);

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify error massage for description field.
        // Method 1: Check if description field is valid according to browser
        const desErrormessage = await driver.wait(until.elementLocated(By.id('descriptionError')), 5000); 
        const desErrormessageText = await desErrormessage.getText();
        assert.equal(desErrormessageText, 'Description is required', 'Error message should be "Description is required"');
        console.log('✅ Description error message assertion passed!');

        // Step 7:
        // Method 2: verify by checking if balance change or not.
        let balanceAfter = await overview.getBalanceString();
        console.log('Balance amount after submmit= $',balanceAfter);
        expect(balanceAfter).to.equal(balanceBefore);
        console.log('✅ Balance remained assertion passed', balanceBefore);

    });




    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-003
    •⁠ ⁠Test Case : 1 character at Description Field (Min Lenght)
    *
    •⁠ ⁠Description:  Test when user write 1 character only at description field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Write 1 character only description Field. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a"
    *                        - Amount: 100.
    *                        - Type: Income.
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Verify Last Transaction data.
    *
    * Expected Result : Description Field will accept 1 character.
    *******************************************************************************************************/
    it('TC-003: 1 character at Description Field (Min Lenght)', async function ()
    {
        console.log('🔎 TC-003: 1 character at Description Field (Min Lenght)');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');
        await page.fillNotes('test note');

        /*
        // Store balance and total income amount before cilck on add transaction button.
        let balanceBefore = await overview.getBalance();
        let incomeBefore = await overview.getIncome();
        console.log('Balance amount before submmit= $',balanceBefore);
        console.log('Total income before submmit= $',incomeBefore);
        */

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();
        
        /*
        // Step 6: Verify Balance amount changed
        await driver.wait(async () =>                         // Instead of await driver.sleep() to wait for balance changed.
            {
                const current = await overview.getBalance(); // Get current balance
                return current !== balanceBefore;           // Condition TRUE or FALSE to check if balance updated or not
            }, 5000);                                       // Timeout if balance didn't changed

        let balanceAfter = await overview.getBalance();
        console.log('Balance amount before submmit= $',balanceBefore);
        console.log('Balance amount after submmit= $',balanceAfter);
        expect(balanceAfter - balanceBefore).to.equal(100);
       //expect(balanceAfter).to.be.greaterThan(balanceBefore);
        console.log('✅ Balance changed assertion passed');


        // Step 7: Verify Total Income amount changed.
        let incomeAfter = await overview.getIncome();
        console.log('Total income before submmit= $',incomeBefore);
        console.log('Total income after submmit= $',incomeAfter);
        expect(incomeAfter - incomeBefore).to.equal(100);
       //expect(balanceAfter).to.be.greaterThan(balanceBefore);
        console.log('✅ Total income changed assertion passed');
        */
        // Step 7: Verify Last Transaction data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('a');
        //expect(lastTransaction.amount).to.equal('$ 100');
        console.log('✅ Last transaction data assertion passed');

    });



    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-004
    •⁠ ⁠Test Case : 100 characters at Description Field (Max Lenght)
    *
    •⁠ ⁠Description:  Test when user write 100 characters only at description field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Write 100 characters only description Field. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "QR3POSZ2rqdbZgBnG6mIwIE7d9ZRsZ4RM0Qm5EhdTIv21mPS59yissZz9yBfo7rsqZFZHWC8Zlltl6cVOfnerJlaZFTjz4LQv2O4".
    *                        - Amount: 100.
    *                        - Type: Income.
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data.
    *
    * Expected Result : Description Field will accept 100 characters.
    *******************************************************************************************************/
    it('TC-004: 100 characters at Description Field (Max Lenght)', async function ()
    {
        console.log('🔎 TC-004: 100 characters at Description Field (Max Lenght)');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('QR3POSZ2rqdbZgBnG6mIwIE7d9ZRsZ4RM0Qm5EhdTIv21mPS59yissZz9yBfo7rsqZFZHWC8Zlltl6cVOfnerJlaZFTjz4LQv2O4');
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 7: Verify Last Transaction data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('QR3POSZ2rqdbZgBnG6mIwIE7d9ZRsZ4RM0Qm5EhdTIv21mPS59yissZz9yBfo7rsqZFZHWC8Zlltl6cVOfnerJlaZFTjz4LQv2O4');
        console.log('✅ Last transaction data assertion passed');
    });


    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-005
    •⁠ ⁠Test Case : Exceeding characters limit at Description Field (Out of Boundries)
    *
    •⁠ ⁠Description:  Test when user write 101 characters only at description field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Write 101 characters at description Field. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "QR3POSZ2rqdbZgBnG6mIwIE7d9ZRsZ4RM0Qm5EhdTIv21mPS59yissZz9yBfo7rsqZFZHWC8Zlltl6cVOfnerJlaZFTjz4LQv2O41".   
    *                        - Amount: 100.
    *                        - Type: Income.
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should be not update with these data.
    *                   7. Verify description error massage.
    *
    * Expected Result : Description Field will reject 101 characters, and display error "Description must be less than 100 characters"
    *******************************************************************************************************/
    it('TC-005: Exceeding characters limit at Description Field (Out of Boundries)', async function ()
    {
        console.log('🔎 TC-005: Exceeding characters limit at Description Field (Out of Boundries)');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('QR3POSZ2rqdbZgBnG6mIwIE7d9ZRsZ4RM0Qm5EhdTIv21mPS59yissZz9yBfo7rsqZFZHWC8Zlltl6cVOfnerJlaZFTjz4LQv2O41');
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.description).not.equal('QR3POSZ2rqdbZgBnG6mIwIE7d9ZRsZ4RM0Qm5EhdTIv21mPS59yissZz9yBfo7rsqZFZHWC8Zlltl6cVOfnerJlaZFTjz4LQv2O41');
        console.log('✅ Last transaction data not updated with description out of boundries lenght assertion passed');

        // Step 7: Verify description error massage.
        const descriptionError = await driver.wait(until.elementLocated(By.id('descriptionError')), 5000).getText();
        expect(descriptionError).to.equal('Description must be less than 100 characters');
        console.log('✅ Description error massage displayed assertion passed:',descriptionError);
    });    




    
    });




/*============================================================================================================================================== *
 *                                                   Test Suite for Amount Field                                                             *
 *===============================================================================================================================================*/

describe('Amount Field Test Suite', function () 
{
 let driver;
 let page;
 let overview;

 beforeEach(async function () 
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
         console.log('🟢 Step 8: Page object created\n');
         
     } 
     catch (error)
     {
        console.log('\n🔴 ERROR:', error.message);
         throw error;
     }
     
     
 });

 afterEach(async function () 
 {
    console.log('\n🔒 Closing browser...');
     await driver.quit();
 });


    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-006
    •⁠ ⁠Test Case : Negative number at amount field (Out of Boundries)
    *
    •⁠ ⁠Description:  Test when user write negative number at amount field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Write negative number at amount Field. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: -50.
    *                        - Type: Income.
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should be not update with these data.
    *                   7. Verify description error massage.
    *
    * Expected Result : Amount Field will reject -50, and display error "Please enter a valid positive amount"
    *******************************************************************************************************/
    it('TC-006: Write Negative Number at amount field (Out of Boundries)', async function ()
    {
        console.log('🔎 TC-006: Write Negative Number at amount field (Out of Boundries)');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(-50);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.description).not.equal('a');
        console.log('✅ Last transaction data not updated with description out of boundries lenght assertion passed');

        // Step 7: Verify description error massage.
        const amountError = await driver.wait(until.elementLocated(By.id('amountError')), 5000).getText();
        expect(amountError).to.equal('Please enter a valid positive amount');
        console.log('✅ Amount error massage displayed assertion passed:',amountError);

    }); 


    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-007
    •⁠ ⁠Test Case : Minimum number at amount field (Min Amount)
    *
    •⁠ ⁠Description:  Test when user write Minimum number at amount field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Write Minimum number at amount Field. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: 0.01.
    *                        - Type: Income.
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should be updated with these data.
    *
    * Expected Result : Amount Field will accept 0.01.
    *******************************************************************************************************/
    it('TC-007: Write Minimum Number at amount field (Min Amount)', async function ()
    {
        console.log('🔎 TC-007: Write Minimum Number at amount field (Min Amount)');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(0.01);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.amount).to.equal('$ 0.01');
        console.log('✅ Last transaction data assertion passed');

    });     


    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-008
    •⁠ ⁠Test Case : Maximum number at amount field (Max Amount)
    *
    •⁠ ⁠Description:  Test when user write Maximum number at amount field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Write Maximum number at amount Field. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: 999,999.99
    *                        - Type: Income.
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should be updated with these data.
    *
    * Expected Result : Amount Field will accept 999,999.99
    *******************************************************************************************************/
    it('TC-008: Write Maximum Number at amount field (Max Amount)', async function ()
    {
        console.log('🔎 TC-008: Write Maximum Number at amount field (Max Amount)');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(999999.99);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.amount).to.equal('$ 999999.99');
        console.log('✅ Last transaction data assertion passed');

    }); 

/* Bug found app accept 1,000,000.00 which it above of max value that should be allwoed */
    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-009
    •⁠ ⁠Test Case : Exceeding Maximum number at amount field (Out of Boundries)
    *
    •⁠ ⁠Description:  Test when user try to exceeding Maximum number at amount field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Write Maximum number at amount Field. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: 1,000,000.00
    *                        - Type: Income.
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should be updated with these data.
    *
    * Expected Result : Amount Field will reject 1,000,000.00 and display error "Amount seems too large"
    *******************************************************************************************************/
    it('TC-009: Try to Exceeding Maximum Number at amount field (Out of Boundries)', async function ()
    {
        console.log('🔎 TC-009: Try to Exceeding Maximum Number at amount field (Out of Boundries)');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(1000000.00);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.amount).not.equal('$ 1000000.00');
        console.log('✅ Last transaction data assertion passed and not be updated');

        // Step 7: Verify description error massage.
        const amountError = await driver.wait(until.elementLocated(By.id('amountError')), 5000).getText();
        expect(amountError).to.equal('Amount seems too large');
        console.log('✅ Amount error massage displayed assertion passed:',amountError);        
    }); 


    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-010
    •⁠ ⁠Test Case : Three Decimal number at amount field.
    *
    •⁠ ⁠Description:  Test when user try to write three decimal number at amount field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Write three decimal number at amount Field. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: 5.001
    *                        - Type: Income.
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should be updated with these data.
    *
    * Expected Result : Amount Field will reject 5.001 and display error "Please enter a vaild value. The two nearest valid values are 5 and 5.01"
    *******************************************************************************************************/
    it('TC-010: Try to write three decimal Number at amount field (0.001)', async function ()
    {
        console.log('🔎 TC-010: Try to write three decimal Number at amount field (0.001)');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(5.001);
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.amount).not.equal('$ 5.001');
        console.log('✅ Last transaction data assertion passed and not be updated');

        // Step 7: Verify amount error massage.
        const isValid = await driver.executeScript(`return document.getElementById('amount').validity.valid;`);
        assert.equal(isValid, false, 'Please enter a vaild value. The two nearest valid values are 5 and 5.01');
        console.log('✅ Amount field is invalid when try to write three decimal (0.001) assertion passed');    
    });     


    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-011
    •⁠ ⁠Test Case : Empty amount field.
    *
    •⁠ ⁠Description:  Test when user forget to write number at amount field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Leave amount field empty. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: "".
    *                        - Type: Income.
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should NOT be updated with these data.
    *
    * Expected Result : Amount Field will should display error "Please fill out this field."
    *******************************************************************************************************/
    it('TC-011: Test when user forget to write number at amount field', async function ()
    {
        console.log('🔎 TC-011: Test when user forget to write number at amount field');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.selectType('income');
        await page.selectCategory('Salary');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.description).not.equal('a');
        console.log('✅ Last transaction data assertion passed and not be updated');

        // Step 7: Verify amount error massage.
        const isValid = await driver.executeScript(`return document.getElementById('amount').validity.valid;`);
        assert.equal(isValid, false, 'Please fill out this field.');
        console.log('✅ Amount field is invalid when when user forget to write a number, assertion passed');    
    });        




});



/*============================================================================================================================================== *
 *                                                   Test Suite for Type Field                                                             *
 *===============================================================================================================================================*/

describe('Amount Field Test Suite', function () 
{
 let driver;
 let page;
 let overview;

 beforeEach(async function () 
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
         console.log('🟢 Step 8: Page object created\n');
         
     } 
     catch (error)
     {
        console.log('\n🔴 ERROR:', error.message);
         throw error;
     }
     
     
 });

 afterEach(async function () 
 {
    console.log('\n🔒 Closing browser...');
     await driver.quit();
 });



    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-012
    •⁠ ⁠Test Case : Empty Type.
    *
    •⁠ ⁠Description:  Test when user forget to select type at type field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Dont select any type leave it empty. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: 100.
    *                        - Type: "".
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should NOT be updated with these data.
    *
    * Expected Result : Type Field should display error "Please select an item in the list"
    *******************************************************************************************************/
    it('TC-012: Empty Type Field', async function ()
    {
        console.log('🔎 TC-012: Empty Type Field');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n','✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectCategory('Salary');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.description).not.equal('a');
        console.log('✅ Last transaction data assertion passed and not be updated');

        // Step 7: Verify amount error massage.
        const isValid = await driver.executeScript(`return document.getElementById('type').validity.valid;`);
        assert.equal(isValid, false, 'Please select an item in the list');
        console.log('✅ Type field is invalid when user forget to select whether income or expenses type, assertion passed');    
    });    




    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-013
    •⁠ ⁠Test Case : Income Type.
    *
    •⁠ ⁠Description:  Test when select income type at type field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Select income type. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: 100.
    *                        - Type: "income".
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should be updated with these data.
    *                   7. Verify Balance amount changed.
    *                   8. Verify Income amount changed.
    *
    * Expected Result : Transaction data should be updated, balance and income increased.
    *******************************************************************************************************/
    it('TC-013: Income Type Field', async function ()
    {
        console.log('🔎 TC-013: Income Type Field');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('income');
        await page.selectCategory('Salary');


        // Store balance and total income amount before cilck on add transaction button.
        let balanceBefore = await overview.getBalance();
        let incomeBefore = await overview.getIncome();
        console.log('\nBalance amount before submmit= $',balanceBefore);
        console.log('Total income before submmit= $',incomeBefore, '\n');       

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('a');
        expect(lastTransaction.amount).to.equal('$ 100');
        expect(lastTransaction.type.toLowerCase()).to.equal('Income'.toLowerCase());
        expect(lastTransaction.categoryValue.toLowerCase()).to.equal('Salary'.toLowerCase());
        console.log('✅ Last transaction data updated assertion passed');

        // Step 7: Verify Balance amount changed.
        let balanceAfter = await overview.getBalance();
        console.log('Balance amount before submmit= $',balanceBefore);
        console.log('Balance amount after submmit= $',balanceAfter);
        expect(balanceAfter - balanceBefore).to.equal(100);
       //expect(balanceAfter).to.be.greaterThan(balanceBefore);
        console.log('✅ Balance increase changed assertion passed');

        // Step 8: Verify Total Income amount changed.
        let incomeAfter = await overview.getIncome();
        console.log('Total income before submmit= $',incomeBefore);
        console.log('Total income after submmit= $',incomeAfter);
        expect(incomeAfter - incomeBefore).to.equal(100);
       //expect(balanceAfter).to.be.greaterThan(balanceBefore);
        console.log('✅ Total income increase changed assertion passed');  
    });     


    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-014
    •⁠ ⁠Test Case : Expense Type.
    *
    •⁠ ⁠Description:  Test when select expense type at type field and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Select expense type. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: 100.
    *                        - Type: "expense".
    *                        - Category: Salary.
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should be updated with these data.
    *                   7. Verify Balance amount changed.
    *                   8. Verify expenses amount changed.
    *
    * Expected Result : Transaction data should be updated, balance decreased and expense increased.
    *******************************************************************************************************/
    it('TC-014: Expense Type Field', async function ()
    {
        console.log('🔎 TC-014: Expense Type Field');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('expense');
        await page.selectCategory('Salary');


        // Store balance and total income amount before cilck on add transaction button.
        let balanceBefore = await overview.getBalance();
        let expensesBefore = await overview.getExpenses();
        console.log('\nBalance amount before submmit= $',balanceBefore);
        console.log('Total income before submmit= $',expensesBefore, '\n');       

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('a');
        expect(lastTransaction.amount).to.equal('$ -100');
        expect(lastTransaction.type.toLowerCase()).to.equal('expense'.toLowerCase());
        expect(lastTransaction.categoryValue.toLowerCase()).to.equal('Salary'.toLowerCase());
        console.log('✅ Last transaction data updated assertion passed');

        // Step 7: Verify Balance amount changed.
        let balanceAfter = await overview.getBalance();
        console.log('Balance amount before submmit= $',balanceBefore);
        console.log('Balance amount after submmit= $',balanceAfter);
        expect(balanceBefore - balanceAfter).to.equal(100);
       //expect(balanceAfter).to.be.greaterThan(balanceBefore);
        console.log('✅ Balance decrease changed assertion passed');

        // Step 8: Verify Total Income amount changed.
        let expensesAfter = await overview.getExpenses();
        console.log('Total income before submmit= $',expensesBefore);
        console.log('Total income after submmit= $',expensesAfter);
        expect(expensesAfter - expensesBefore).to.equal(100);
       //expect(balanceAfter).to.be.greaterThan(balanceBefore);
        console.log('✅ Total expense increase changed assertion passed');  
    });  







});




/*============================================================================================================================================== *
 *                                                   Test Suite for Category Field                                                             *
 *===============================================================================================================================================*/

describe('Amount Field Test Suite', function () 
{
 let driver;
 let page;
 let overview;

 beforeEach(async function () 
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
         console.log('🟢 Step 8: Page object created\n');
         
     } 
     catch (error)
     {
        console.log('\n🔴 ERROR:', error.message);
         throw error;
     }
     
     
 });

 afterEach(async function () 
 {
    console.log('\n🔒 Closing browser...');
     await driver.quit();
 });



    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-015
    •⁠ ⁠Test Case : Category Field empty.
    *
    •⁠ ⁠Description:  Test when user leave category field empty and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Leave category field empty. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: 100.
    *                        - Type: "income".
    *                        - Category: .
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should be updated with these data.
    *
    * Expected Result : Transaction data should be updated with category "No category"
    *******************************************************************************************************/
    it('TC-015: Category Field Empty', async function ()
    {
        console.log('🔎 TC-014: Category Field Empty');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('income');  

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('a');
        expect(lastTransaction.amount).to.equal('$ 100');
        expect(lastTransaction.type.toLowerCase()).to.equal('Income'.toLowerCase());
        expect(lastTransaction.categoryValue.toLowerCase()).to.equal('No category'.toLowerCase());
        console.log('✅ Last transaction data updated with category "No category" assertion passed');

    });  


    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-016
    •⁠ ⁠Test Case : Category Field Special char (&).
    *
    •⁠ ⁠Description:  Test when user select category that include Special char (&) and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Select category option with Special char (&). 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: 100.
    *                        - Type: "income".
    *                        - Category: "Bills & Utilities".
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should be updated with these data.
    *
    * Expected Result : Transaction data should be updated with category "Bills & Utilities"
    *******************************************************************************************************/
    it('TC-016: Category Field Special char (&)', async function ()
    {
        console.log('🔎 TC-016: Category Field Special char (&)');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('income'); 
        await page.selectCategory('Bills & Utilities');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.description).to.equal('a');
        expect(lastTransaction.amount).to.equal('$ 100');
        expect(lastTransaction.type.toLowerCase()).to.equal('Income'.toLowerCase());
        expect(lastTransaction.categoryDisplay.toLowerCase()).to.equal('Bills & Utilities'.toLowerCase());
        expect(lastTransaction.categoryValue.toLowerCase()).to.equal('bills'.toLowerCase());
        console.log('✅ Last transaction data updated with category "Bills & Utilities" assertion passed');

    });  


});



/*============================================================================================================================================== *
 *                                                   Test Suite for Date Field                                                             *
 *===============================================================================================================================================*/

describe('Amount Field Test Suite', function () 
{
 let driver;
 let page;
 let overview;

 beforeEach(async function () 
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
         console.log('🟢 Step 8: Page object created\n');
         
     } 
     catch (error)
     {
        console.log('\n🔴 ERROR:', error.message);
         throw error;
     }
     
     
 });

 afterEach(async function () 
 {
    console.log('\n🔒 Closing browser...');
     await driver.quit();
 });


    /*****************************************************************************************************
    •⁠ ⁠Test ID : TC-017
    •⁠ ⁠Test Case : Transaction with past date.
    *
    •⁠ ⁠Description:  Test when user select an old date and click on add transaction button.
    •⁠ ⁠Test Procedure :  1. Navigate to page's App.
    *                   2. Verify that page opened successfully.
    *                   3. Select an old date. 
    *                   4. Fill other field with these data required for the test:
    *                        - Description: "a".   
    *                        - Amount: 100.
    *                        - Type: "income".
    *                        - Category: "Bills & Utilities".
    *                        - Date: "2024-01-15"
    *                   5. Click "Add Transaction".
    *                   6. Verify Last Transaction data should be updated with these data.
    *
    * Expected Result : Transaction data should be updated with date 
    *******************************************************************************************************/
    it('TC-017: Date Field: Test when user select an old date', async function ()
    {
        console.log('🔎 TC-017: Date Field: Test when user select an old date');
        // Step 1: Verify that page opened successfully.
        const HeaderPage = await driver.wait(until.elementLocated(By.css('.header h1')), 5000);   // By.css('.header h1').
        const HeaderPageText = await HeaderPage.getText();

        // Step 2: Verify that header text is "Personal Finance Tracker".
        assert.equal(HeaderPageText, "Personal Finance Tracker", 'Header text should be "Personal Finance Tracker"');
        // expect(HeaderPageText).to.equal('Personal Finance Tracker');
        console.log('\n✅ Header assertion passed!\n');

        // Step 3 & 4: Fill other field with these data required for the test:
        await page.fillDescription('a');
        await page.fillAmount(100);
        await page.selectType('income'); 
        await page.selectCategory('Bills & Utilities');
        await page.selectDate('2024-01-15');

        // Step 5: Cilck on add transaction button.
        await page.addTransaction();

        // Step 6: Verify Last Transaction data not updated with these data.
        const lastTransaction = await transcationlist.getLastTransactionData();
        console.log('Last transaction data:', lastTransaction);
        expect(lastTransaction.date).to.equal('2024-01-15');
        console.log('✅ Last transaction data updated with an old date, assertion passed');

    }); 












});












// ============================================
// MAIN TEST FUNCTION
// ============================================

// async: Keyword that allows us to use 'await' inside this function
// 'await' pauses execution until a promise completes (like waiting for page to load)
async function testOpenApplication() 
{
    
    // ------------------------------------------
    // STEP 1: CREATE BROWSER DRIVER
    // ------------------------------------------
    
    // new Builder(): Creates a builder object
    // .forBrowser('chrome'): Tells it to use Chrome browser
    // .build(): Actually creates the driver and opens Chrome
    // 'await' waits for Chrome to fully start before continuing
    let driver = await new Builder().forBrowser('chrome').build();
    
    // ------------------------------------------
    // STEP 2: EXECUTE TEST WITH ERROR HANDLING
    // ------------------------------------------
    
    // try-catch-finally: Error handling structure
    // try: Code that might fail goes here
    // catch: Runs if an error occurs
    // finally: Always runs (even if error occurs) - we use it to close browser
    try {
        
        /*
         * Get the absolute path to your HTML file
         * __dirname: Current directory where this Test.js file is located
         *            In your case: J:\University\Testing\Practicing Testing\Finance_Tracker_App\Tests\Selenium
         *            its always give the path where i start the run it like on my project i write in terminal
         *            node test.js so every time i use __dirname its give me location of file test.js
         *            __dirname change based on: Where the FILE physically exists, not where you ran the node command from.
         * '..': Go up one folder level (to Tests)
         * '..': Go up another level (to Finance_Tracker_App - your project root)
         * 'App': Go into the App folder
         * 'finance_tracker_app.html': Your HTML file name
         *
         */
        
        const htmlPath = path.join(__dirname, '..', '..', 'App', 'finance_tracker_app.html');
        /*
        console.log("1 step back htmlPath: ", htmlPath);
        htmlPath = path.join(htmlPath, '..');
        console.log("2 step back htmlPath: ", htmlPath);
        htmlPath = path.join(htmlPath, 'App');
        console.log("App htmlPath: ", htmlPath);
        htmlPath = path.join(htmlPath, 'finance_tracker_app.html');
        console.log("finance_tracker_app.html htmlPath: ", htmlPath);
        */

        // Print the path to console so you can verify it's correct
        console.log('📂 HTML Path:', htmlPath);
        
        // Convert Windows path to file URL format
        // Windows uses backslashes (\), but URLs need forward slashes (/)
        // .replace(/\\/g, '/'): Replaces all \ with /
        // 'file:///' prefix: Tells browser to open a local file
        const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
        
        // Print URL to verify
        console.log('🌐 File URL:', fileUrl);
        
        // ------------------------------------------
        // STEP 3: OPEN THE APPLICATION
        // ------------------------------------------
        
        // driver.get(url): Navigates browser to the URL
        // 'await' waits for page to fully load before continuing
        await driver.get(fileUrl);
        
        // Maximize browser window (makes it easier to see what's happening)
        // driver.manage(): Access browser management functions
        // .window(): Access window-specific functions
        // .maximize(): Make window full screen
        await driver.manage().window().maximize();
        
        console.log('✅ Page opened successfully');
        
        // ------------------------------------------
        // STEP 4: WAIT FOR PAGE TO LOAD COMPLETELY
        // ------------------------------------------
        
        // driver.sleep(milliseconds): Pause execution for specified time
        // 2000 milliseconds = 2 seconds
        // This gives the page time to render all elements
        // Note: In production, use explicit waits instead of sleep (more reliable)
        await driver.sleep(2000);
        
        // ------------------------------------------
        // STEP 5: FIND AND VERIFY PAGE HEADING
        // ------------------------------------------
        
        // driver.findElement(): Locates an element on the page
        // By.css('h1'): Use CSS selector to find <h1> tag
        // Other options: By.id('description'), By.className('btn'), etc.
        // .getText(): Gets the text content of the element
        // 'await' waits for element to be found and text to be retrieved
        const heading = await driver.findElement(By.css('h1')).getText();
        
        // Print the heading text to console
        console.log('📝 Heading found:', heading);
        
        // ------------------------------------------
        // STEP 6: VERIFY RESULT
        // ------------------------------------------
        
        // Simple check: Does heading contain expected text?
        if (heading.includes('Personal Finance Tracker')) 
        {
            console.log('✅ TEST PASSED: Application loaded correctly!');
        } 
        else 
        {
            console.log('❌ TEST FAILED: Unexpected heading:', heading);
        }
        
        // Keep browser open for 3 seconds so you can see it
        console.log('⏳ Keeping browser open for 3 seconds...');
        await driver.sleep(3000);
        
    } 
    catch (error) 
    {
        // If ANY error occurs in try block, this runs
        console.error('❌ TEST FAILED WITH ERROR:');
        console.error(error.message);
        
        // You can take screenshot on error (optional)
        // const screenshot = await driver.takeScreenshot();
        // require('fs').writeFileSync('error.png', screenshot, 'base64');
        
    } 
    finally 
    {
        // This ALWAYS runs, even if there was an error
        // driver.quit(): Closes browser and ends the session
        // Very important! Without this, browser stays open
        console.log('🔒 Closing browser...');
        await driver.quit();
    }
}

// ============================================
// EXECUTE THE TEST
// ============================================

// Call the test function to start execution
// This is what actually runs when you type: node Test.js
//testOpenApplication();