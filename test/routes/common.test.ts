import { extractIds } from '../../src/routes/common';

describe('fn extractIds()', () => {
  it('returns correct set of ids (userId)', () => {
    expect(extractIds("userId", {
      userId: "asdf"
    }, "query")).toMatchObject({
      userId: "asdf"
    });
    expect(extractIds("userId", {
      userId: ""
    }, "insert")).toBeDefined();
  });
  it('returns correct set of ids (budgetId)', () => {
    expect(extractIds("budgetId", {
      userId: "asdf",
      budgetId: "12311n"
    }, "query")).toMatchObject({
      userId: "asdf",
      budgetId: "12311n"
    });
  });
  it('returns correct set of ids (accountId)', () => {
    expect(extractIds("accountId", {
      userId: "asdf",
      budgetId: "12311n",
      accountId: "6789"
    }, "update")).toMatchObject({
      userId: "asdf",
      budgetId: "12311n",
      accountId: "6789"
    });
  });
  it('returns correct set of ids (transactionId)', () => {
    expect(extractIds("transactionId", {
      userId: "asdf",
      budgetId: "12311n",
      accountId: "6789",
      transactionId: "aaqwljk"
    }, "update")).toMatchObject({
      userId: "asdf",
      budgetId: "12311n",
      accountId: "6789",
      transactionId: "aaqwljk"
    });
  });
  it('returns correct userId set with extra properties in body', () => {
    expect(extractIds("userId", {
      hello: "this",
      is: "extra",
      content: ":)",
      userId: "asdf",
      budgetId: "12311n",
      accountId: "6789",
      transactionId: "aaqwljk"
    }, "query")).toMatchObject({
      userId: "asdf"
    });
  });
  it('returns correct accountId set with extra properties in body', () => {
    expect(extractIds("accountId", {
      accountId: "6789",
      hello: "this",
      is: "extra",
      content: ":)",
      userId: "asdf",
      budgetId: "12311n",
    }, "query")).toMatchObject({
      userId: "asdf",
      budgetId: "12311n",
      accountId: "6789"
    });
  });
  it('returns blank id for main id (operation=query)', () => {
    expect(extractIds("transactionId", {
      userId: "asdf",
      budgetId: "12311n",
      accountId: "af",
      transactionId: null
    }, "query")).toMatchObject({
      userId: "asdf",
      budgetId: "12311n",
      accountId: "af",
      transactionId: ""
    });
    expect(extractIds("transactionId", {
      userId: "asdf",
      budgetId: "12311n",
      accountId: "af"
    }, "query")).toMatchObject({
      userId: "asdf",
      budgetId: "12311n",
      accountId: "af",
      transactionId: ""
    });
  });
  it('returns random id (operation=insert)', () => {
    const ids = extractIds("accountId", {
      userId: "asdf",
      budgetId: "12311n",
      accountId: "",
    }, "insert");

    expect(ids).toBeDefined();
    expect(ids.accountId).toBeTruthy();

    const expectedData = {
      userId: "asdf",
      budgetId: "12311n",
      accountId: ids.accountId,
    }
    expect(ids).toMatchObject(expectedData);
  });
  it('throws error if source does not have required id (operation=query)', () => {
    expect(() => extractIds("accountId", {
      userId: "asdf",
      accountId: "12311n",
    }, "query")).toThrow(/Missing id in source/);
    expect(() => extractIds("accountId", {
      userId: "asdf",
      budgetId: "",
      accountId: "12311n",
    }, "query")).toThrow(/Missing id in source/);
    expect(() => extractIds("accountId", {
      userId: "asdf",
      budgetId: null,
      accountId: "12311n",
    }, "query")).toThrow(/Missing id in source/);
  });
  it('throws error if source does not have required id (operation=update)', () => {
    expect(() => extractIds("accountId", {
      userId: "asdf",
      budgetId: "12311n",
    }, "update")).toThrow(/Missing id in source/);
    expect(() => extractIds("accountId", {
      userId: "asdf",
      budgetId: "12311n",
      accountId: "",
    }, "update")).toThrow(/Missing id in source/);
    expect(() => extractIds("accountId", {
      userId: "asdf",
      budgetId: "12311n",
      accountId: null
    }, "update")).toThrow(/Missing id in source/);
  });
  it('throws error if source is empty object', () => {
    expect(() => extractIds("userId", {}, "update")).toThrow(/Missing id in source/);
    expect(() => extractIds("accountId", {}, "insert")).toThrow(/Missing id in source/);
    expect(() => extractIds("transactionId", {}, "query")).toThrow(/Missing id in source/);
  });
});
