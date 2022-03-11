import { createAttrs, generatePk, generateSk, transactionAttrs } from "../../src/models/common";
import { IdGroup } from "../../src/types/types";




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
        }, transactionAttrs)).toMatchObject({
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
        }, transactionAttrs)).toMatchObject({
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
        }, transactionAttrs)).toThrow(/Invalid body parameters/);
    });
    it("throws error if there are attrs with the wrong type", () => {
        expect(() => createAttrs({
            value: "1000",
            is_start_bal: 12,
            is_outflow: true,
            trans_date: false,
        }, transactionAttrs)).toThrow(/Invalid body parameters/);
    });
    it("throws error if body param is non-object", () => {
        expect(() => createAttrs(false, transactionAttrs)).toThrow(/Body parameter is not an object/);
        expect(() => createAttrs(0, transactionAttrs)).toThrow(/Body parameter is not an object/);
        expect(() => createAttrs("", transactionAttrs)).toThrow(/Body parameter is not an object/);
        expect(() => createAttrs(true, transactionAttrs)).toThrow(/Body parameter is not an object/);
        expect(() => createAttrs(100, transactionAttrs)).toThrow(/Body parameter is not an object/);
    });
    it("throws error if body param is undefined/null/etc", () => {
        expect(() => createAttrs(null, transactionAttrs)).toThrow(/Body parameter is/);
        expect(() => createAttrs(undefined, transactionAttrs)).toThrow(/Body parameter is/);
        expect(() => createAttrs(NaN, transactionAttrs)).toThrow(/Body parameter is/);
    });
})

/**
 * 
 */
describe("test fn generatePk()", () => {
    it("returns valid pk for user and budget params", () => {
        expect(generatePk(new IdGroup("userId", {
            userId: "123"
        }))).toBe("user_");

        expect(generatePk(new IdGroup("userId", {
            userId: null
        }))).toBe("user_");

        expect(generatePk(new IdGroup("userId", {
            userId: "     "
        }))).toBe("user_");

        expect(generatePk(new IdGroup("budgetId", {
            userId: "123",
            budgetId: "safjas-asd"
        }))).toBe("user_123#budget_");

        expect(generatePk(new IdGroup("budgetId", {
            userId: "123a",
            budgetId: ""
        }))).toBe("user_123a#budget_");

        expect(generatePk(new IdGroup("budgetId", {
            userId: "123a",
            budgetId: "   "
        }))).toBe("user_123a#budget_");
    });
    it("returns valid pk for account and transaction params", () => {
        expect(generatePk(new IdGroup("accountId", {
            userId: "a63234",
            budgetId: "9095",
            accountId: null
        }))).toBe("user_a63234#budget_9095");

        expect(generatePk(new IdGroup("accountId", {
            userId: "123",
            budgetId: "safjas-asd",
            accountId: "hello"
        }))).toBe("user_123#budget_safjas-asd");

        expect(generatePk(new IdGroup("transactionId", {
            userId: "1",
            budgetId: "89",
            accountId: "293",
            transactionId: ""
        }))).toBe("user_1#budget_89");

        expect(generatePk(new IdGroup("transactionId", {
            userId: "1",
            budgetId: "89",
            accountId: "293",
            transactionId: "1231"
        }))).toBe("user_1#budget_89");
    });
});

/**
 * 
 */
describe("test fn generateSk()", () => {
    it("returns valid sk for user param", () => {
        expect(generateSk(new IdGroup("userId", {
            userId: "123"
        }))).toBe("user_123");
    });
    it("throws error if userId is null/empty string", () => {
        expect(() => {
            generateSk(new IdGroup("userId", {
                userId: "",
            }));
        }).toThrow(/userId not specified/);

        expect(() => {
            generateSk(new IdGroup("userId", {
                userId: "    ",
            }));
        }).toThrow(/userId not specified/);

        expect(() => {
            generateSk(new IdGroup("userId", {
                userId: null,
            }));
        }).toThrow(/userId not specified/);
    });
    it("returns valid sk for budget param", () => {
        expect(generateSk(new IdGroup("budgetId", {
            userId: "asdf",
            budgetId: "mmm"
        }))).toBe("user_asdf#budget_mmm");
    });
})

