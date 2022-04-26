import { generatePk, generateSk } from "../../src/models/common";
import { IdGroup } from "../../src/types/types";

/**
 * 
 */
describe("fn generatePk()", () => {
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
describe("fn generateSk()", () => {
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

