import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { constants, createItem, reduceIds } from "../libs/common"
import type { AccountAttrs, AccountParamGroup, TransactAttrs, TransactParamGroup } from "../types/types";

export const getTransactions = async (db: DynamoDBDocumentClient, transInfo: TransactParamGroup) => {
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
        const data = await db.send(new QueryCommand(params));
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

/**
 * Inserts or updates a transaction
 * @param db 
 * @param transInfo
 * @param attrs 
 * @returns 
 */
export const putTransaction = async (db: DynamoDBDocumentClient, transInfo: TransactParamGroup,
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
        const data = await db.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
        console.log(`Transaction id: ${transInfo.transactionId}`);
        return { transactionId: transInfo.transactionId };
    } catch (err) {
        console.log("Error with put: " + err);
        return "Error with put: " + err;
    }
}
