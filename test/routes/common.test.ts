import { constants } from '../../src/lib/common';
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
  it('returns random id when inserting', () => {
    const ids = extractIds("accountId", {
      userId: "asdf",
      budgetId: "12311n",
      accountId: "",
    }, "query");
    
    expect(ids).toBeDefined();
    expect(ids.accountId).toBeTruthy();

    const expectedData = {
      userId: "asdf",
      budgetId: "12311n",
      accountId: ids.accountId,
    }
    expect(ids).toMatchObject(expectedData);
  });
});

// describe('fn computeId()', () => {
//   it('returns id correctly', () => {
//     expect(computeId("userId", "userId", "adfasd", "query")).toBe("adfasd");
//   });
//   it('returns random id for insert operation', () => {
//     expect(computeId("transactionId", "transactionId", "", "insert")).toBeTruthy();
//   });
//   it('returns random id for insert operation', () => {
//     expect(computeId("budgetId", "transactionId", "", "insert")).toBeTruthy();
//   });
// })