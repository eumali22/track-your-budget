import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { reduceIds, putItem, createAttrs, budgetAttrs } from "./common";
import { BudgetAttrs, BudgetParamGroup, IdGroup } from "../types/types";
import { ddbDocClient as db } from "../libs/ddbDocClient";
import { constants } from "../libs/common";

export const getBudgets = async (budgetInfo: BudgetParamGroup) => {
    const partitionKey = reduceIds({
        userId: budgetInfo.userId,
        budgetId: null,
    });
    const sortKey = reduceIds(budgetInfo);
    const getAll: boolean = (budgetInfo.budgetId == null || budgetInfo.budgetId.trim() == "");
    let exprAttrVals;
    let keyCondExpr;
    if (getAll) {
        exprAttrVals = { ":pk": partitionKey };
        keyCondExpr = "PK = :pk";
    } else {
        exprAttrVals = { ":pk": partitionKey, ":sk": sortKey };
        keyCondExpr = "PK = :pk AND begins_with(SK, :sk)"
    }
    const params = {
        TableName: constants.tableName,
        ExpressionAttributeValues: exprAttrVals,
        KeyConditionExpression: keyCondExpr,
        ProjectionExpression: "SK, budget_name",
    };

    try {
        const data = await db.send(new QueryCommand(params));
        // console.log("Fetch success!");
        return data.Items;
    } catch (err) {
        console.log("Error fetching: " + err);
        return "Error fetching: " + err;
    }
}


// export const putBudget = async (budgetInfo: BudgetParamGroup,
//     attrs: BudgetAttrs) => {

//     const partitionKey = reduceIds({
//         userId: budgetInfo.userId,
//         budgetId: "",
//     });
//     const sortKey = reduceIds(budgetInfo);
//     const params = {
//         TableName: constants.tableName,
//         Item: createItem<BudgetAttrs>(partitionKey, sortKey, attrs),
//     };

//     try {
//         const data = await db.send(new PutCommand(params));
//         console.log("Success - item added or updated", data);
//         console.log(`Budget id: ${budgetInfo.budgetId}`);
//         return { budgetId: budgetInfo.budgetId };
//     } catch (err) {
//         console.log("Error with put: " + err);
//         return "Error with put: " + err;
//     }
// }

export const putBudget = async (budget: BudgetParamGroup, body: any) => {
    const attrs: BudgetAttrs = createAttrs(body, budgetAttrs);
    return putItem<BudgetAttrs>(new IdGroup("budgetId", budget), attrs);
}