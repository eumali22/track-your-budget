import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { createItem, reduceIds } from "./common"
import type { TransactAttrs, TransactParamGroup } from "../types/types";
import { ddbDocClient as database} from "../libs/ddbDocClient";
import { constants } from "../libs/common";

export const getTransactions = async (transInfo: TransactParamGroup) => {
    const partitionKey = reduceIds({
        userId: transInfo.userId,
        budgetId: transInfo.budgetId,
    });
    const sortKey = reduceIds(transInfo);
    const params = {
        TableName: constants.tableName,
        ExpressionAttributeValues: {
            ":pk": partitionKey,
            ":sk": sortKey,
        },
        ExpressionAttributeNames: {
            "#value": "value",
        },
        KeyConditionExpression: "PK = :pk AND begins_with ( SK, :sk )",
        ProjectionExpression: "SK, trans_date, #value, is_outflow",
    };

    try {
        const data = await database.send(new QueryCommand(params));
        console.log("Fetch success!");
        if (data.Count === 0) {
            return "No results for transactionid=" + transInfo.transactionId;
        }
        return data.Items;
    } catch (err) {
        console.log("Error fetching: " + err);
        return "Error fetching: " + err;
    }
};


export const putTransaction = async (transInfo: TransactParamGroup,
    attrs: TransactAttrs) => {
    
    const partitionKey = reduceIds({
        userId: transInfo.userId,
        budgetId: transInfo.budgetId,
    });
    const sortKey = reduceIds(transInfo);
    const params = {
        TableName: constants.tableName,
        Item: createItem<TransactAttrs>(partitionKey, sortKey, attrs),
    };

    try {
        const data = await database.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
        console.log(`Transaction id: ${transInfo.transactionId}`);
        return { transactionId: transInfo.transactionId };
    } catch (err) {
        console.log("Error with put: " + err);
        return "Error with put: " + err;
    }
}
