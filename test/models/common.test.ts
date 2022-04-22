import { reduceIds, filterId, createItem, createAttrs, Attributes } from "../../src/models/common";
import { AccountAttrs, BudgetAttrs, TransactAttrs } from "../../src/types/types";


/**
 * fn reduceIds() TO DO test maxReduction
 */
describe("fn reduceIds()", () => {
    it('builds SK for querying one user->budget->account->transaction', () => {
        let ids = {
            "userId": "29554",
            "budgetId": "4",
            "accountId": "5",
            "transactionId": "3081",
        }
        expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_5#trans_3081");
    });

    it('builds SK for querying all user->budget->account->transactions', () => {
        let ids = {
            "userId": "29554",
            "budgetId": "4",
            "accountId": "15",
            "transactionId": "",
        }
        expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_15#trans_");
    });

    it('builds SK for querying one user->budget->account', () => {
        let ids = {
            "userId": "29554",
            "budgetId": "4",
            "accountId": "15",
        }
        expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_15");
    });

    it('builds SK for querying all user->budget->accounts', () => {
        let ids = {
            "userId": "29554",
            "budgetId": "4",
            "accountId": null,
        }
        expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_");
    });

    it('builds SK for querying one user->budget', () => {
        let ids = {
            "userId": "29554",
            "budgetId": "78",
        }
        expect(reduceIds(ids)).toBe("user_29554#budget_78");
    });

    it('builds SK for querying all user->budgets', () => {
        let ids = {
            "userId": "29554",
            "budgetId": "",
        }
        expect(reduceIds(ids)).toBe("user_29554#budget_");
    });

    it('builds SK for querying one user', () => {
        let ids = {
            "userId": "5484",
        }
        expect(reduceIds(ids)).toBe("user_5484");
    });

    it('builds PK for querying all users', () => {
        let ids = {
            "userId": "",
        }
        expect(reduceIds(ids)).toBe("user_");
    });

    it('builds PK for querying all user->budgets', () => {
        let ids = {
            "userId": "29554",
            "budgetId": "",
        }
        expect(reduceIds(ids)).toBe("user_29554#budget_");
    });

    it('builds PK for querying all child items under one budget', () => {
        let ids = {
            "userId": "29554",
            "budgetId": "1",
        }
        expect(reduceIds(ids)).toBe("user_29554#budget_1");
    });

    /* other cases */

    it('works when passed with mixed string/number parameters', () => {
        let ids = {
            "userId": "29554",
            "budgetId": "4",
            "accountId": "5",
            "transactionId": "3081",
        }
        expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_5#trans_3081");
    });

    it('works when last property is null', () => {
        let ids = {
            "userId": "29554",
            "budgetId": "4",
            "accountId": "5",
            "transactionId": null,
        }
        expect(reduceIds(ids)).toBe("user_29554#budget_4#acct_5#trans_");
        let ids2 = {
            "userId": "29554",
            "budgetId": null
        }
        expect(reduceIds(ids2)).toBe("user_29554#budget_");
    });
});

/**
 * fn filterId()
 */
describe("fn filterId()", () => {
    // it("returns empty string for filterId(array)", () => {
    //     expect(filterId([1, 'a'])).toBe('');
    // });
    // it("returns empty string for filterId(object)", () => {
    //     expect(filterId({a: 1})).toBe('');
    // });
    it("returns empty string for filterId(null)", () => {
        expect(filterId(null)).toBe('');
    });
    it("returns empty string for filterId(undefined)", () => {
        expect(filterId(undefined)).toBe('');
    });
    // it("returns empty string for filterId(NaN)", () => {
    //     expect(filterId(NaN)).toBe('');
    // });
    // it("returns empty string for filterId(Infinity)", () => {
    //     expect(filterId(1/0)).toBe('');
    // });
    // it("returns empty string for filterId(-Infinity)", () => {
    //     expect(filterId(-1/0)).toBe('');
    // });
    // it("returns empty string for filterId(true)", () => {
    //     expect(filterId(true)).toBe('');
    // });
    // it("returns 123 for filterId(123)", () => {
    //     expect(filterId(123)).toBe(123);
    // });
    it("returns 'a' for filterId('a')", () => {
        expect(filterId('a')).toBe('a');
    });
    it("returns 'hello world!@#' for filterId('hello world!@#')", () => {
        expect(filterId('hello world!@#')).toBe('hello world!@#');
    });

});

/**
 * fn createItem() 
 */
describe("fn createItem()", () => {
    it("creates a valid budget item from the params", () => {
        expect(createItem<BudgetAttrs>("afasf", "aaaa", {
            budget_name: "new Budget",
        })).toMatchObject({
            PK: "afasf",
            SK: "aaaa",
            budget_name: "new Budget",
        });
    });
    it("creates a valid account item from the params", () => {
        expect(createItem<AccountAttrs>("afasf", "aaaa", {
            account_name: "new Acct",
        })).toMatchObject({
            PK: "afasf",
            SK: "aaaa",
            account_name: "new Acct",
        });
    });
    it("creates a valid transaction item from the params", () => {
        expect(createItem<TransactAttrs>("123", "456", {
            is_start_bal: true,
            is_outflow: true,
            trans_date: "111111111",
            value: 100,
        })).toMatchObject({
            PK: "123",
            SK: "456",
            is_start_bal: true,
            is_outflow: true,
            trans_date: "111111111",
            value: 100,
        });
    });

});

/**
 * fn createAttrs() TO DO test other attr group types
 */
describe("fn createAttrs()", () => {
    it("returns a budget attribute group", () => {
        const body = {
            budget_name: "hey there"
        };
        expect(createAttrs(body, Attributes.budgetAttrs)).toMatchObject({
            budget_name: "hey there"
        });
    });
    it("returns a transaction attribute group", () => {
        const body = {
            trans_date: "0123456789012",
            is_start_bal: false,
            is_outflow: true,
            category: "cat",
            another: 23,
            memo: "",
            value: 1200,
            extra: "field"
        };
        expect(createAttrs(body, Attributes.transactionAttrs)).toMatchObject({
            "is_start_bal": false,
            "is_outflow": true,
            "category": "cat",
            "trans_date": "0123456789012",
            "memo": "",
            "value": 1200
        });
    });
});