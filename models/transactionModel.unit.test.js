import {buildSortKey, reduceIds} from "./transactionModel.js"

/*
test('fn buildSortKey: pass userId parameter only', () => {
    expect(buildSortKey("567")).toBe("user_567");
});

test('fn buildSortKey: pass userId and acctId parameters only', () => {
    expect(buildSortKey("523", "51")).toBe("user_523#acct_51");
});

test('fn buildSortKey: pass userId, acctId, transId parameters', () => {
    expect(buildSortKey(8, 1, 7)).toBe("user_8#acct_1#trans_7");
});

test('fn buildSortKey: validate SK for get all accounts', () => {
    expect(buildSortKey(12, '')).toBe("user_12#acct_");
    expect(buildSortKey(2, null)).toBe("user_2#acct_");
    expect(buildSortKey(2, false)).toBe("user_2#acct_");
});

test('fn buildSortKey: validate SK for get all transactions', () => {
    expect(buildSortKey(8, "2", '')).toBe("user_8#acct_2#trans_");
    expect(buildSortKey('123', 2, '')).toBe("user_123#acct_2#trans_");
    expect(buildSortKey('1', 2, null)).toBe("user_1#acct_2#trans_");
    expect(buildSortKey(2, 1, false)).toBe("user_2#acct_1#trans_");
});

*/

test('fn reduceIds: build key to query single transaction', () => {
    let ids = {
        "userId": "29554",
        "budgetId": "4",
        "accountId": "5",
        "transactionId": "3081",
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_5#trans_3081");
});

test('fn reduceIds: build key to query all transactions', () => {
    let ids = {
        "userId": "29554",
        "budgetId": "4",
        "accountId": "15",
        "transactionId": "",
    }
    expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_15#trans_");
});