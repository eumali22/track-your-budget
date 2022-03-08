import { createItem, filterId, reduceIds, createAttrs } from "../../src/libs/common";
import { BudgetAttrs, AccountAttrs, TransactAttrs } from "../../src/types/types";


/**
 * fn reduceIds()
 */
describe("test reduceIds()", () => {
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
describe("test filterId()", () => {
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
 * 
 */
describe("test fn createItem()", () => {
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
 * 
 */
describe("test fn createAttrs()", () => {
    it("accepts body arg with extra properties passed", () => {
        expect(createAttrs({
            is_start_bal: true,
            is_outflow: true,
            category: "yeah",
            trans_date: "112312312312",
            memo: "whut",
            value: 100,
            extra: "hey",
            properties: "yeah"
        })).toMatchObject({
            value: 100,
            is_start_bal: true,
            is_outflow: true,
            category: "yeah",
            trans_date: "112312312312",
            memo: "whut"
        });
    });
    it("accepts body arg without the optional attrs", () => {
        expect(createAttrs({
            is_start_bal: true,
            trans_date: "43342",
            is_outflow: true,
            value: 1000,
        })).toMatchObject({
            value: 1000,
            is_start_bal: true,
            is_outflow: true,
            trans_date: "43342",
        });
    });
    it("throws error if there are missing required attrs", () => {
        expect(() => createAttrs({
            is_start_bal: true,
            trans_date: "43342",
            is_outflow: true,
        })).toThrow(/Invalid body parameters/);
    });
    it("throws error if there are attrs with the wrong type", () => {
        expect(() => createAttrs({
            value: "1000",
            is_start_bal: 12,
            is_outflow: true,
            trans_date: false,
        })).toThrow(/Invalid body parameters/);
    });
    it("throws error if body param is non-object", () => {
        expect(() => createAttrs(false)).toThrow(/Body parameter is not an object/);
        expect(() => createAttrs(0)).toThrow(/Body parameter is not an object/);
        expect(() => createAttrs("")).toThrow(/Body parameter is not an object/);
        expect(() => createAttrs(true)).toThrow(/Body parameter is not an object/);
        expect(() => createAttrs(100)).toThrow(/Body parameter is not an object/);
    });
    it("throws error if body param is undefined/null/etc", () => {
        expect(() => createAttrs(null)).toThrow(/Body parameter is/);
        expect(() => createAttrs(undefined)).toThrow(/Body parameter is/);
        expect(() => createAttrs(NaN)).toThrow(/Body parameter is/);
    });
})
