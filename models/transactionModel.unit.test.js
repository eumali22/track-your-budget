import {buildSortKey} from "./transactionModel.js"

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
});

test('fn buildSortKey: validate SK for get all transactions', () => {
    expect(buildSortKey(8, "2", '')).toBe("user_8#acct_2#trans_");
    expect(buildSortKey('123', 50763, '')).toBe("user_123#acct_50763#trans_");
});