import { createItem } from "../../src/libs/common";
import { BudgetAttrs, AccountAttrs, TransactAttrs } from "../../src/types/types";

describe("test fn createItem()", () => {
    it("creates a valid budget item from the params", () => {
        expect(createItem<BudgetAttrs>("afasf", "aaaa", {
            budget_name: "new Budget",
        })).toMatchObject({
            primaryKey: "afasf",
            sortKey: "aaaa",
            budget_name: "new Budget",
        });
    });
    it("creates a valid account item from the params", () => {
        expect(createItem<AccountAttrs>("afasf", "aaaa", {
            account_name: "new Acct",
        })).toMatchObject({
            primaryKey: "afasf",
            sortKey: "aaaa",
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
            primaryKey: "123",
            sortKey: "456",
            is_start_bal: true,
            is_outflow: true,
            trans_date: "111111111",
            value: 100,
        });
    });
    
});