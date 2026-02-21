// By is a Selenium locator utility
// We use it to locate elements by id, name, css selector, etc.
const { By, until, Select } = require('selenium-webdriver');


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
        let description = await this.browserdriver.wait(until.elementLocated(By.id('description')), 5000);
        await description.clear();
        await description.sendKeys(descriptionText);
        console.log('🖊 Description filled with: ' + descriptionText);
    }

    /***************************
     *        Amount           *
     ***************************/
    async fillAmount(amountValue)
    {
        let amount = await this.browserdriver.wait(until.elementLocated(By.id('amount')), 5000);
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
        const element = await this.browserdriver.wait(until.elementLocated(By.id('type')), 5000);

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
        const select = await this.browserdriver.wait(until.elementLocated(By.id('category')), 5000);

        await select.sendKeys(categoryValue);   // <option value="transport">Transportation</option> type first letter like if you send Transportation its send "T".

        console.log('Category selected:', categoryValue);

        /*const element = await this.browserdriver.wait(until.elementLocated(By.id('category')), 5000);
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
        await this.browserdriver.findElement(By.id('date')).sendKeys(date);
        await this.browserdriver.findElement(By.id('date')).click();
        console.log('📅 Date filled with: ', date);
    }


    /***************************
     *        Notes            *
     ***************************/
    async fillNotes(notesText)
    {
        let notes = await this.browserdriver.wait(until.elementLocated(By.id('notes')), 5000);
        await notes.clear();
        await notes.sendKeys(notesText);
        console.log('📝 Notes filled with: ' + notesText);
    }


    /***************************
     *       Add Button        *
     ***************************/
    async addTransaction()
    {
        let addBtn = await this.browserdriver.wait(until.elementLocated(By.id('submitBtn')), 5000);
        await addBtn.click();
        console.log('🔳 Transaction add button clicked');
        
        // Wait for the loading state to finish
        // The app shows "Adding..." text during submission
        await this.browserdriver.wait(async () =>               // Wait for the loading state to finish
        {   
            const btnText = await addBtn.getText();       // Get the text of the butto
            return btnText === 'Add Transaction';         // Wait until it's back to normal "'Add Transaction"
        }, 5000);
    
        console.log('🔳 Transaction processing complete\n');       
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
        let balanceElement = await this.browserdriver.wait(until.elementLocated(By.id('balance')), 5000);
        let balance = await balanceElement.getText();
        console.log('\nCurrently the Balance=', balance);
        return balance;
    }

    async getBalance() {
        let balanceElement = await this.browserdriver.wait(until.elementLocated(By.id('balance')), 5000);
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
        let incomeElement = await this.browserdriver.wait(until.elementLocated(By.id('totalIncome')), 5000);
        let income = await incomeElement.getText();
        console.log('\nCurrently the Total Income=', income);
        return income;
    }

    async getIncome() {
        let incomeElement = await this.browserdriver.wait(until.elementLocated(By.id('totalIncome')), 5000);
        let incomeString = await incomeElement.getText();
        let incomeNumber = Number(incomeString.replace(/[$,]/g, ''));
        console.log('\nCurrently the Total Income=', incomeString);
        return incomeNumber;
    }


    /***************************
     *     Expenses Amount     *
     ***************************/
    async getExpensesString() {
        let expensesElement = await this.browserdriver.wait(until.elementLocated(By.id('totalExpenses')), 5000);
        let expenses = await expensesElement.getText();
        console.log('\nCurrently the Total Expenses=', expenses);
        return expenses;
    }

    async getExpenses() {
        let expensesElement = await this.browserdriver.wait(until.elementLocated(By.id('totalExpenses')), 5000);
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

    async getLastTransactionData()
    {
        console.log('Newest Transaction List Data:');
        // Step 1: Get all transactions
        const item = await this.browserdriver.findElements(By.className('transaction-item'));
        

        // Step 2: Return the last transaction (newest transaction)
        const lastItem = await item[0];


        // Step 3: Get the description of last transaction.
        const description = await lastItem.findElement(By.css('h4')).getText();
        console.log('Description:', description);


        // Step 4: Get the amount of last transaction.
        const amountString = await lastItem.findElement(By.className('transaction-amount')).getText();
        let amount = Number(amountString.replace(/[$,]/g, ''));
        console.log('Amount: $', amount);


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
        console.log('Type selected: ' + type);


        // Step 6: Get the category and date of last transaction.
        const categoryDateText = await lastItem.findElement(By.css('.transaction-info p')).getText(); // categoryDateText = "salary • 2026-02-16"
        const parts = categoryDateText.split('•'); // parts = ["salary", "2026-02-16"]

        const category = parts[0].trim();  // category = "salary"
        console.log('Category:', category);

        const date = parts[1].trim();      // date = "2026-02-16"
        console.log('Date:', date);


        // Step 7: Get the note of last transaction.
        let note ='';

        // Will check if note is found or not.
        try
        {
            note = await lastItem.findElement(By.css('.transaction-info em')).getText();
            console.log('Note:', note, '\n');            
        }
        catch
        {
            note = 'Note: No notes found';
            console.log(note,'\n');
        }

        // return data in object.
        return {description, amount: '$ ' + amount, type , category, date,  note};
    }
}


// Export the class so it can be used in other files like Test.js
module.exports = {FinanceTrackerPage, FinancialOverview, TransactionList};