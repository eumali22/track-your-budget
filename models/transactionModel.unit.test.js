import {reduceIds} from "./transactionModel.js"

/* fn reduceIds: normal usage */

test('fn reduceIds: build SK for querying one user->budget->account->transaction', () => {
    let ids = {
        "userId": "29554",
        "budgetId": "4",
        "accountId": "5",
        "transactionId": "3081",
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_5#trans_3081");
});

test('fn reduceIds: build SK for querying all user->budget->account->transactions', () => {
    let ids = {
        "userId": "29554",
        "budgetId": "4",
        "accountId": "15",
        "transactionId": "",
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_15#trans_");
});

test('fn reduceIds: build SK for querying one user->budget->account', () => {
    let ids = {
        "userId": "29554",
        "budgetId": "4",
        "accountId": "15",
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_15");
});

test('fn reduceIds: build SK for querying all user->budget->accounts', () => {
    let ids = {
        "userId": "29554",
        "budgetId": "4",
        "accountId": undefined,
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_");
});

test('fn reduceIds: build SK for querying one user->budget', () => {
    let ids = {
        "userId": "29554",
        "budgetId": "78",
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_78");
});

test('fn reduceIds: build SK for querying all user->budgets', () => {
    let ids = {
        "userId": "29554",
        "budgetId": "",
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_");
});

test('fn reduceIds: build SK for querying one user', () => {
    let ids = {
        "userId": "5484",
    }
    expect(reduceIds(ids)).toBe("user_5484");
});

test('fn reduceIds: build PK for querying all users', () => {
    let ids = {
        "userId": "",
    }
    expect(reduceIds(ids)).toBe("user_");
});

test('fn reduceIds: build PK for querying all user->budgets', () => {
    let ids = {
        "userId": 29554,
        "budgetId": null,
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_");
});

test('fn reduceIds: build PK for querying all child items under one budget', () => {
    let ids = {
        "userId": 29554,
        "budgetId": 1,
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_1");
});

/* other cases */

test('fn reduceIds: passed ids as either strings or numbers should work', () => {
    let ids = {
        "userId": 29554,
        "budgetId": 4,
        "accountId": 5,
        "transactionId": "3081",
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_5#trans_3081");
});

test('fn reduceIds: a null transaction id should return an SK for querying all ' +
    'transactions', () => {
    let ids = {
        "userId": 29554,
        "budgetId": 4,
        "accountId": 5,
        "transactionId": null,
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_5#trans_");
});

