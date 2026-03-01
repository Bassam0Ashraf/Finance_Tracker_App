/* ============================================================
 * Project      : Finance Tracker App
 * File         : Constants.js
 * Description  : Transaction type and category constants
 * Tester       : Bassam Ashraf
 * Date         : 2025-02-26
 * Version      : 1.0
 * ============================================================
 */


/*============================================================================================================================================== *
 *                                                              Constants                                                                        *
 *===============================================================================================================================================*/

// Transaction type constants
const TransactionType = 
{
    INCOME: 'income',
    EXPENSE: 'expense'
};

// Category constants
const Category = 
{
    FOOD: 
    {
        value: 'food',
        display: 'Food & Dining'
    },
    TRANSPORTATION: 
    {
        value: 'transport',
        display: 'Transportation'
    },
    SHOPPING: 
    {
        value: 'shopping',
        display: 'Shopping'
    },
    ENTERTAINMENT: 
    {
        value: 'entertainment',
        display: 'Entertainment'
    },

    BILLS: 
    {
        value: 'bills',
        display: 'Bills & Utilities'
    },
    HEALTHCARE: 
    {
        value: 'healthcare',
        display: 'Healthcare'
    },
    SALARY: 
    {
        value: 'salary',
        display: 'Salary'
    },
    FREELANCE: 
    {
        value: 'freelance',
        display: 'Freelance'
    },
    INVESTMENT:
    {
        value: 'investment',
        display: 'Investment'
    },
    OTHER:
    {
        value: 'other',
        display: 'Other'
    },
    NO_CATEGORY:
    {
        value: 'no category',
        display: 'No category'
    }
};

/*============================================================================================================================================== *
 *                                                               Exports                                                                         *
 *===============================================================================================================================================*/
module.exports = {TransactionType, Category};