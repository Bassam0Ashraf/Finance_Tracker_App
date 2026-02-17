Empty description field
Negative amounts
Zero amounts
Very large amounts (>$1,000,000)
Special characters in description
Future dates
Invalid date formats

# Manual Form Validation Test Results

## Test Session Info
- **Date:** 20/9/2025
- **Tester:** Bassam Ashraf
- **Browser:** Chrome version 140.0.7339.185
- **Environment:** Local file

## Test Results
### Description Field

### TC-001: Empty Description Field
**Steps:**
1. Open finance tracker
2. Leave description field empty
3. Enter amount: 100
4. Select type: income
5. Click "Add Transaction"

- **Expected Result:** Error message displayed "Description is required"
- **Actual Result:** [What actually happened]
- **Status:** PASS/FAIL
- **Screenshot:** [If bug found]



### TC-002: whitespace only Description Field
**Steps:**
1. Open finance tracker.
2. Write whitespace only at description field.
3. Enter amount: 100.
4. Select type: income.
5. Click "Add Transaction".

- **Expected Result:** Error message displayed "Description is required"
- **Actual Result:** [What actually happened]
- **Status:** PASS/FAIL
- **Screenshot:** [If bug found]




### TC-004: 1 character at Description Field (Min Lenght)
**Steps:**
1. Open finance tracker.
2. Write 1 character at description field.
3. Enter amount: 100
4. Select type: income
5. Click "Add Transaction"

- **Expected Result:** Description Field will accept 1 character
- **Actual Result:** [What actually happened]
- **Status:** PASS/FAIL
- **Screenshot:** [If bug found]




### TC-005: 100 character at Description Field (Max Lenght)
**Steps:**
1. Open finance tracker.
2. Write 100 character at description field.
3. Enter amount: 100
4. Select type: income
5. Click "Add Transaction"

- **Expected Result:** Description Field will accept 100 character
- **Actual Result:** [What actually happened]
- **Status:** PASS/FAIL
- **Screenshot:** [If bug found]




### TC-006: 101 character at Description Field (Out of Boundries)
**Steps:**
1. Open finance tracker.
2. Write 101 character at description field.
3. Enter amount: 100
4. Select type: income
5. Click "Add Transaction"

- **Expected Result:** Error message displayed "Description is required"
- **Actual Result:** [What actually happened]
- **Status:** PASS/FAIL
- **Screenshot:** [If bug found]



---
---

### Amount Field
### TC-007: Negative Amount
**Steps:**
1. Enter description: "Test"
2. Enter amount: -50
3. Select type: income
4. Click "Add Transaction"

- **Expected Result:** Should reject negative amount "Please enter a valid positive amount"
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]




### TC-008: Minimum Amount
**Steps:**
1. Enter description: "Test"
2. Enter amount: 0.01
3. Select type: income
4. Click "Add Transaction"

- **Expected Result:** Should accept min amount.
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]



### TC-009: Maximum Amount
**Steps:**
1. Enter description: "Test"
2. Enter amount: 999,999.99
3. Select type: expense
4. Click "Add Transaction"

- **Expected Result:** Should accept max amount.
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]




### TC-009: Out of Boundries of Amount
**Steps:**
1. Enter description: "Test"
2. Enter amount: 1,000,000.00
3. Select type: expense
4. Click "Add Transaction"

- **Expected Result:** Should reject amount "Amount must be between $0.01 and $999,999.99"
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]



### TC-010: Three Decimal Places
**Steps:**
1. Enter description: "Test"
2. Enter amount: 5.001
3. Select type: expense
4. Click "Add Transaction"

- **Expected Result:** Should reject amount because its Three Decimal Places.
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]


---
---

### Transaction Type Field
### TC-011: Empty transaction field
**Steps:**
1. Enter description: "Test"
2. Enter amount: 50
3. Select type: Empty
4. Click "Add Transaction"

- **Expected Result:** Should reject "Please select a transaction type".
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]



---
---

### Category Field
### TC-012: Select Food & Dining for category
**Steps:**
1. Enter description: "Test"
2. Enter amount: 50
3. Select type: expense
4. Select Category: Food & Dining
5. Click "Add Transaction"

- **Expected Result:** Should Accept.
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]



### TC-013: Select Other for category
**Steps:**
1. Enter description: "Test"
2. Enter amount: 50
3. Select type: income
4. Select Category: Other
5. Click "Add Transaction"

- **Expected Result:** Should Accept.
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]



---
---

### Date Field
### TC-014: Select First date in the range (YYY-MM-DD)
**Steps:**
1. Enter description: "Test"
2. Enter amount: 50
3. Select type: income
4. Select Date: 1900-01-01
5. Click "Add Transaction"

- **Expected Result:** Should Accept.
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]




### TC-015: Select Last date in the range (YYY-MM-DD)
**Steps:**
1. Enter description: "Test"
2. Enter amount: 50
3. Select type: income
4. Select Date: 2099-12-31
5. Click "Add Transaction"

- **Expected Result:** Should Accept.
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]



### TC-016: Select date out of the range (YYY-MM-DD)
**Steps:**
1. Enter description: "Test"
2. Enter amount: 50
3. Select type: income
4. Select Date: 2100-01-01
5. Click "Add Transaction"

- **Expected Result:** Should reject "Must be valid date format".
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]




### TC-017: Select date invalid format (YYY-DD-MM) instaed of (YYY-MM-DD)
**Steps:**
1. Enter description: "Test"
2. Enter amount: 50
3. Select type: income
4. Select Date: 2100-15-01
5. Click "Add Transaction"

- **Expected Result:** Should reject "Must be valid date format".
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]





---
---

### Notes Field
### TC-018: Write 200 characters (Max Lenght)
**Steps:**
1. Enter description: "Test"
2. Enter amount: 50
3. Select type: income
4. Add Notes: "Reviewed budget with fiancé: updated savings goal for anniversary trip, adjusted recurring transfers, recorded vendor quotes for venue and caterer, set follow-up next Tue to finalize deposit. followup"
5. Click "Add Transaction"

- **Expected Result:** Should Accept.
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]




### TC-019: Write 201 characters (Out of Lenght)
**Steps:**
1. Enter description: "Test"
2. Enter amount: 50
3. Select type: income
4. Add Notes: "Reviewed budget with fiancé: updated savings goal for anniversary trip, adjusted recurring transfers, recorded vendor quotes for venue and caterer, set follow-up next Tue to finalize deposit. follow-up"
5. Click "Add Transaction"

- **Expected Result:** Should rejected.
- **Actual Result:** 
- **Status:** PASS/FAIL
- **Notes:** [Additional observations]














