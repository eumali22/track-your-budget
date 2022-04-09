import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { reduceIds, putItem, createAttrs, budgetAttrs } from "./common";
import { BudgetAttrs, BudgetParamGroup, IdGroup } from "../types/types";
import { ddbDocClient as db } from "../lib/ddbDocClient";
import { constants } from "../lib/common";

export const getBudgets = async (budgetParams: BudgetParamGroup) => {
    const partitionKey = reduceIds({
        userId: budgetParams.userId,
        budgetId: null,
    });
    const sortKey = reduceIds(budgetParams);
    const getAll: boolean = (budgetParams.budgetId == null || budgetParams.budgetId.trim() == "");
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
        return data.Items;
    } catch (err) {
        console.log("Error fetching: " + err);
        return "Error fetching: " + err;
    }
}

export const putBudget = async (budget: BudgetParamGroup, body: any) => {
    const attrs: BudgetAttrs = createAttrs(body, budgetAttrs);
    return putItem<BudgetAttrs>(new IdGroup("budgetId", budget), attrs);
}
