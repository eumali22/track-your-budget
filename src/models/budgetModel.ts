import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { constants, reduceIds } from "../libs/common";
import { BudgetParamGroup } from "../types/types";
import { ddbDocClient as db} from "../libs/ddbDocClient";

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