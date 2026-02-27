/* ============================================================
 * Project      : Finance Tracker App
 * File         : FinanceTrackerPage.js
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
const { By, Select } = require('selenium-webdriver');
const { waitFor, waitForAlert, waitForElements, SLEEP_SHORT, SLEEP_MEDIUM, SLEEP_LONG, TIMEOUT } = require('../Utils/waitUtils');


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

        await select.sendKeys(categoryValue);   // <option value="transport">Transportation</option> type first letter like if you send Transportation its send "T".

        console.log('Category selected:', categoryValue);

        /*const element = await this.browserdriver.wait(until.elementLocated(By.id('category')), SLEEP_LONG);
        await this.browserdriver.sleep(1000);
        // Step 2: Create Select wrapper
        const dropdown = new Select(element);
        await this.browserdriver.sleep(1000);
        // Step 3: Select value
        await dropdown.selectByVisibleText(categoryValue);
        await this.browserdriver.sleep(1000);
        // Done! No click or sendKeys needed
        console.log('Category selected: ' + categoryValue);*/
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
    async deleteTransaction(index)
    {
        let transactionData = await transcationlist.TransactionData(index);

        let deleteBtn = await waitForElements(this.browserdriver, By.css('.delete-btn'), SLEEP_LONG);
        await deleteBtn[index].click();
        console.log('❌ Delete button clicked.');

        await waitForAlert(this.browserdriver, SLEEP_LONG);
        await this.browserdriver.switchTo().alert().accept();
        console.log('❌ Confirm of deleting the transaction.');
        
        console.log('❌ Transaction Data got Deleted:', transactionData,'\n');
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
        const categoryMap = 
        {
            'food': 'Food & Dining',
            'transport': 'Transportation',
            'shopping': 'Shopping',
            'entertainment': 'Entertainment',
            'bills': 'Bills & Utilities',
            'healthcare': 'Healthcare',
            'salary': 'Salary',
            'freelance': 'Freelance',
            'investment': 'Investment',
            'other': 'Other'
        };
    
        const categoryDisplay = categoryMap[categoryValue] || categoryValue;
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