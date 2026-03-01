/* ============================================================
 * Project      : Finance Tracker App
 * File         : FinanceTrackerPage.js
 * Description  : Page Object Model for the Finance Tracker App.
 *                Encapsulates all UI interactions — form filling,
 *                dropdown selection, button clicks, and data
 *                retrieval — into reusable methods consumed by
 *                the Mocha test suites in Test.js.
 * Tester       : Bassam Ashraf
 * Date         : 2025-02-26
 * Version      : 1.0
 * Dependencies : Selenium WebDriver, waitUtils
 * ============================================================
 */
/*============================================================================================================================================== *
 *                                                               Imports                                                                         *
 *===============================================================================================================================================*/
// By     : Selenium locator strategies used to find elements on the page (By.id, By.css, etc.).
// Select : Selenium wrapper for interacting with <select> dropdown elements.
const { By, Select } = require('selenium-webdriver');
const { waitFor, waitForAlert, waitForElements, SLEEP_SHORT, SLEEP_MEDIUM, SLEEP_LONG, TIMEOUT } = require('../Utils/waitUtils');
const { Category } = require('../Utils/Constants');


/*============================================================================================================================================== *
 *                                                              Function                                                                         *
 *===============================================================================================================================================*/
class FinanceTrackerPage {
    constructor(browserdriver)
    {
        // Your code: Save driver
        this.browserdriver = browserdriver;
    }

    /***************************
     *      Description        *
     ***************************/
    async fillDescription(descriptionText)
    {
        // Your code:
        // 1. Find element with ID 'description'
        // 2. Clear it
        // 3. Send keys (text)
        let description = await waitFor(this.browserdriver, By.id('description'), SLEEP_LONG);
        await description.clear();
        await description.sendKeys(descriptionText);
        console.log('🖊 Description filled with: ' + descriptionText);
    }

    /***************************
     *        Amount           *
     ***************************/
    async fillAmount(amountValue)
    {
        let amount = await waitFor(this.browserdriver, By.id('amount'), SLEEP_LONG);
        await amount.clear();
        await amount.sendKeys(amountValue);
        console.log('💵 Amount filled with: $' + amountValue);
    }


    /***************************
     *         Type            *
     ***************************/
    async selectType(typeValue)
    {
        // This one is different - it's a dropdown!
        // Hint: You need Select from selenium-webdriver
        // Element ID is 'type'
        // You'll need: new Select(element).selectByValue(type);

        // Step 1: Find element
        const element = await waitFor(this.browserdriver, By.id('type'), SLEEP_LONG);

        // Step 2: Create Select wrapper
        const dropdown = new Select(element);

        // Step 3: Select value
        await dropdown.selectByValue(typeValue);    // <option value="income">Income</option> send word in (value="....").

        // Done! No click or sendKeys needed
        console.log('Type selected: ' + typeValue);
    }


    /***************************
     *        Category         *
     ***************************/
    async selectCategory(categoryValue)
    {
        const select = await waitFor(this.browserdriver, By.id('category'), SLEEP_LONG);

        // Using sendKeys to type the first letter(s) of the category name, which causes the native
        // <select> element to jump to the matching option. For example, passing "Transportation"
        // triggers the 'T' key and selects the first option whose visible text starts with that letter.
        // This approach was chosen because the Select.selectByVisibleText() alternative (archived below)
        // produced timing and stale-element issues during testing.
        await select.sendKeys(categoryValue);

        console.log('Category selected:', categoryValue);

        /*====================================================================================================
         * ARCHIVED ALTERNATIVE — Select.selectByVisibleText()
         * ----------------------------------------------------
         * The block below was an earlier implementation that used Selenium's Select wrapper to choose
         * a category by its full visible text (e.g. "Transportation"). It was replaced by the sendKeys
         * approach above due to intermittent timing and stale-element exceptions encountered during
         * test execution. Retained here for reference.
         *====================================================================================================
        const element = await this.browserdriver.wait(until.elementLocated(By.id('category')), SLEEP_LONG);
        await this.browserdriver.sleep(1000);
        const dropdown = new Select(element);
        await this.browserdriver.sleep(1000);
        await dropdown.selectByVisibleText(categoryValue);
        await this.browserdriver.sleep(1000);
        console.log('Category selected: ' + categoryValue);
        *====================================================================================================*/
    }


    /***************************
    *          Date            *
    ***************************/
    async selectDate(date)
    {
        await this.browserdriver.executeScript(`document.getElementById('date').value = arguments[0];`,date);
        console.log('📅 Date filled with: ', date);
    }


    /***************************
     *        Notes            *
     ***************************/
    async fillNotes(notesText)
    {
        let notes = await waitFor(this.browserdriver, By.id('notes'), SLEEP_LONG);
        await notes.clear();
        await notes.sendKeys(notesText);
        console.log('📝 Notes filled with: ' + notesText);
    }


    /***************************
     *       Add Button        *
     ***************************/
    async addTransaction()
    {
        let addBtn = await waitFor(this.browserdriver, By.id('submitBtn'), SLEEP_LONG);
        await addBtn.click();
        console.log('🔳 Transaction add button clicked');
        
        // Wait for the loading state to finish
        // The app shows "Adding..." text during submission
        await this.browserdriver.wait(async () =>               // Wait for the loading state to finish
        {   
            const btnText = await addBtn.getText();       // Get the text of the butto
            return btnText === 'Add Transaction';         // Wait until it's back to normal "'Add Transaction"
        }, SLEEP_LONG);
    
        console.log('🔳 Transaction processing complete\n');       
    }


    /***************************
     *      Delete Button      *
     ***************************/

    /**
     * Deletes the transaction at the given list index by clicking its Delete button and
     * confirming the resulting browser alert dialog.
     *
     * ⚠️  NOTE: The call to `transcationlist.TransactionData(index)` on the line below will
     *     throw a ReferenceError at runtime because `transcationlist` is not defined within
     *     this class. If pre-deletion data capture is needed, the TransactionList instance
     *     must be passed in as a parameter or stored on the class.
     *
     * @param {number} index - Zero-based index of the transaction to delete (0 = newest).
     */
    async deleteTransaction(index)
    {
        // Capture the transaction's data before deletion for logging purposes.
        // ⚠️ BUG: 'transcationlist' is not defined in this scope — this line will throw a
        //    ReferenceError. Pass the TransactionList instance as a parameter to fix this.
        let transactionData = await transcationlist.TransactionData(index);

        // Locate all Delete buttons and click the one at the specified index.
        let deleteBtn = await waitForElements(this.browserdriver, By.css('.delete-btn'), SLEEP_LONG);
        await deleteBtn[index].click();
        console.log('❌ Delete button clicked for transaction at index:', index);

        // Wait for the confirmation alert and accept it to confirm deletion.
        await waitForAlert(this.browserdriver, SLEEP_LONG);
        await this.browserdriver.switchTo().alert().accept();
        console.log('❌ Deletion confirmed via alert dialog.');

        console.log('❌ Deleted transaction data:', transactionData, '\n');
    }    


}


/***********************************************
 *            Financial Overview               *
 ***********************************************/


class FinancialOverview {
    constructor(browserdriver) {
        // Your code: Save driver
        this.browserdriver = browserdriver;
    }

    /***************************
     *     Balance Amount      *
     ***************************/
    async getBalanceString() {
        let balanceElement = await waitFor(this.browserdriver, By.id('balance'), SLEEP_LONG);
        let balance = await balanceElement.getText();
        console.log('\nCurrently the Balance=', balance);
        return balance;
    }

    async getBalance() {
        let balanceElement = await waitFor(this.browserdriver, By.id('balance'), SLEEP_LONG);
        let balanceString = await balanceElement.getText();
        let balanceNumber = Number(balanceString.replace(/[$,]/g, '')); // Remove $ and , if exist and convert it to number ($12,447.50)
        // parseFloat(balanceString.replace('$', '')); 
        console.log('\nCurrently the Balance=', balanceString);
        return balanceNumber;
    }


    /***************************
     *      Income Amount      *
     ***************************/
    async getIncomeString() {
        let incomeElement = await waitFor(this.browserdriver, By.id('totalIncome'), SLEEP_LONG);
        let income = await incomeElement.getText();
        console.log('\nCurrently the Total Income=', income);
        return income;
    }

    async getIncome() {
        let incomeElement = await waitFor(this.browserdriver, By.id('totalIncome'), SLEEP_LONG);
        let incomeString = await incomeElement.getText();
        let incomeNumber = Number(incomeString.replace(/[$,]/g, ''));
        console.log('\nCurrently the Total Income=', incomeString);
        return incomeNumber;
    }


    /***************************
     *     Expenses Amount     *
     ***************************/
    async getExpensesString() {
        let expensesElement = await waitFor(this.browserdriver, By.id('totalExpenses'), SLEEP_LONG);
        let expenses = await expensesElement.getText();
        console.log('\nCurrently the Total Expenses=', expenses);
        return expenses;
    }

    async getExpenses() {
        let expensesElement = await waitFor(this.browserdriver, By.id('totalExpenses'), SLEEP_LONG);
        let expensesString = await expensesElement.getText();
        let expensesNumber = Number(expensesString.replace(/[$,]/g, ''));
        console.log('\nCurrently the Total Expenses=', expensesString);
        return expensesNumber;
    }
}


/***********************************************
 *            Transaction List                 *
 ***********************************************/


class TransactionList
{
    constructor(browserdriver)
    {
        // Your code: Save driver
        this.browserdriver = browserdriver;
    }

    async TransactionData(index)
    {
        //console.log('Newest Transaction List Data:');
        // Step 1: Get all transactions
        const item = await waitForElements(this.browserdriver, By.className('transaction-item'), SLEEP_LONG);
        

        // Step 2: Return the last transaction (newest transaction)
        const lastItem = await item[index];


        // Step 3: Get the description of last transaction.
        const descriptionEl = await waitFor(this.browserdriver, By.xpath(`(//*[contains(@class,"transaction-item")])[${index + 1}]//h4`), SLEEP_LONG);
        const description = await descriptionEl.getText();
        //console.log('Description:', description);


        // Step 4: Get the amount of last transaction.
        const amountString = await lastItem.findElement(By.className('transaction-amount')).getText();
        let amount = Number(amountString.replace(/[$,]/g, ''));
        //console.log('Amount: $', amount);


        // Step 5: Get the type of last transaction.
        const typeElement = await lastItem.findElement(By.className('transaction-amount')).getAttribute('class');;
        let type = '';
        if (typeElement.includes('income'))
        {
            type = 'income';
        } 
        else if (typeElement.includes('expense'))
        {
            type = 'expense';
        }
        //console.log('Type selected: ' + type);


        // Step 6: Get the category and date of last transaction.
        const categoryDateEl = await waitFor(this.browserdriver, By.xpath(`(//*[contains(@class,"transaction-item")])[${index + 1}]//*[contains(@class,"transaction-info")]//p`), SLEEP_LONG);
        const categoryDateText = await categoryDateEl.getText(); // categoryDateText = "salary • 2026-02-16"
        const parts = categoryDateText.split('•'); // parts = ["salary", "2026-02-16"]

        const categoryValue  = parts[0].trim();  // category = "salary"
        //console.log('Category Value :', categoryValue );

        // Map internal value to display text
        const categoryDisplay = Object.values(Category)
        .find(cat => cat.value === categoryValue)?.display || Category.NO_CATEGORY.display;
        //console.log('Category display:', categoryDisplay);


        const date = parts[1].trim();      // date = "2026-02-16"
        //console.log('Date:', date);


        // Step 7: Get the note of last transaction.
        let note ='';

        // Will check if note is found or not.
        try
        {
            note = await lastItem.findElement(By.css('.transaction-info em')).getText();
            //console.log('Note:', note, '\n');            
        }
        catch
        {
            note = 'No notes found';
           // console.log('Note:',note,'\n');
        }

        // return data in object.
        return {description, amount: '$ ' + amount, type , categoryDisplay, categoryValue , date,  note};
    }

    
    async getTransactionCount()
    {
        const items = await waitForElements(this.browserdriver, By.className('transaction-item'), SLEEP_LONG);

        const transactionCount = items.length;
        
        console.log('🔢 Transaction count:', transactionCount,'\n');
        return transactionCount;
    }
}


/*============================================================================================================================================== *
 *                                                               Exports                                                                         *
 *===============================================================================================================================================*/
// Export the class so it can be used in other files like Test.js
module.exports = {FinanceTrackerPage, FinancialOverview, TransactionList};