import { getBudgets, putBudget } from "../../src/models/budgetModel";
import { DynamoDBDocumentClient, PutCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { putItem, createAttrs } from "../../src/models/common";

/**
 * fn getBudgets()
 * mocks send() to simulate database calls.
 */
describe("test fn getBudgets()", () => {
    it('returns correct single budget Item', async () => {
        const mockReturnData = {
            Items: [{
                SK: "user_27#budget_234",
                budget_name: "This is my budget name"
            }],
            $metadata: ""
        };

        let exprAttrVals: {[key: string]: any} | undefined;
        let keyCondExpr: string | undefined;
        jest.spyOn(DynamoDBDocumentClient.prototype, 'send').mockImplementationOnce((command) => {
            const qci:QueryCommandInput = command.input as QueryCommandInput;
            exprAttrVals = qci.ExpressionAttributeValues;
            keyCondExpr = qci.KeyConditionExpression;
            return Promise.resolve(mockReturnData);
        });

        const data = await getBudgets({
            userId: "27",
            budgetId: "234"
        });

        expect(data).toMatchObject(mockReturnData.Items);
        expect(exprAttrVals).toMatchObject({ ":pk": "user_27#budget_", ":sk": "user_27#budget_234" });
        expect(keyCondExpr).toBe("PK = :pk AND begins_with(SK, :sk)");
    });

    it('returns all budget Items if param has null/empty string budgetId', async () => {
        const mockReturnData = {
            Items: [{
                SK: "user_27#budget_234",
                budget_name: "This is my budget name"
            }, {
                SK: "user_27#budget_56",
                budget_name: "Another"
            }],
            $metadata: ""
        };

        let exprAttrVals: { [key: string]: any } | undefined;
        let keyCondExpr: string | undefined;
        jest.spyOn(DynamoDBDocumentClient.prototype, 'send').mockImplementationOnce((command) => {
            const qci: QueryCommandInput = command.input as QueryCommandInput;
            exprAttrVals = qci.ExpressionAttributeValues;
            keyCondExpr = qci.KeyConditionExpression;
            return Promise.resolve(mockReturnData);
        });

        const data = await getBudgets({
            userId: "27",
            budgetId: null
        });

        expect(data).toStrictEqual(mockReturnData.Items);
        expect(exprAttrVals).toMatchObject({ ":pk": "user_27#budget_" });
        expect(keyCondExpr).toBe("PK = :pk");
    });
})

/**
 * 
 */
jest.mock("../../src/models/common", () => ({
    ...jest.requireActual('../../src/models/common') as object,
    createAttrs: jest.fn().mockReturnValueOnce({
        budget_name: "bname!"
    }),
    putItem: jest.fn().mockResolvedValueOnce({
        PK: "user_1#budget_",
        SK: "user_1#budget_3"
    }),
}));

describe("test fn putBudget()", () => {
    it("creates an item given correct values", async () => {
        const data = await putBudget({
            userId: "1",
            budgetId: "3"
        }, {
            budget_name: "budget name updated!"
        });

        expect(createAttrs).toHaveBeenCalledTimes(1);
        expect(putItem).toHaveBeenCalledTimes(1);
        expect(data).toMatchObject({
            PK: "user_1#budget_",
            SK: "user_1#budget_3"
        });
    });
})