import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { constants, createItem } from "../libs/common"
import type { AllIdKeys, AllParamGroup, BudgetParamGroup } from "../types/types";
import type { TransactAttrs, TransactParamGroup, XORParamGroups } from "../types/types";

export const idPrefixes: Readonly<AllParamGroup> = {
    userId: "user_",
    budgetId: "budget_",
    accountId: "acct_",
    transactionId: "trans_",
};

// TO DO hardcoded for now
const USER_ID = "1";
const BUDGET_ID = "1";
const ACCT_ID = "1";

/**
 * Builds a key (partition or sort key) using the ids parameter.
 * @param {ParamGroup} ids Object that holds the ids to query.
 * @example
 * const sortKey = reduceIds({
 *     "userId": "29554",
 *     "budgetId": "4",
 *     "accountId": "5",
 *     "transactionId": "",
 * });
 * @returns a string to be used as partition key or sort key.
 */
export function reduceIds(ids: XORParamGroups): string {
    // if (typeof ids !== 'object') return "";

    return Object.keys(idPrefixes).reduce((prevVal, currVal) => {
        // return empty string if current id not part of query object
        if (!Object.keys(ids).includes(currVal)) {
            return prevVal;
        }
        const d = (prevVal === '') ? '' : constants.delimiter;
        const prefix = idPrefixes[currVal as AllIdKeys];
        const currId = filterId(ids[currVal as AllIdKeys]);
        return prevVal + d + prefix + currId;
    }, '');
}

export function filterId(id: string | null | undefined) {
    // if (typeof id === 'number' && isNaN(id)) {
    //     return '';
    // }
    // if (typeof id === 'number' && !isFinite(id)) {
    //     return '';
    // }
    return (['string', 'number'].includes(typeof id)) ? id : "";
}

/**
 * Fetches transactions from the database.
 * @param {string} transId the transaction id
 * @returns all transactions returned if transId is null or empty string. otherwise
 * returns a single transaction item with transaction id = transId.
 */
export const getTransactions = async (db: DynamoDBDocumentClient, transId: string | null) => {
    const partitionKey = reduceIds({
        userId: USER_ID,
        budgetId: BUDGET_ID,
    });
    const sortKey = reduceIds({
        userId: USER_ID,
        budgetId: BUDGET_ID,
        accountId: ACCT_ID,
        transactionId: transId,
    });
    let params = {
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
        console.log("Fetch success.");
        if (data.Count === 0) {
            return "No results for transactionid=" + transId;
        }
        return data.Items;
    } catch (err) {
        console.log("Error fetching: " + err);
        return "Error fetching: " + err;
    }
};


/**
 * Inserts or updates a transaction.
 * @param pkIds 
 * @param skIds 
 * @param attrs 
 * @returns an object or string wrapped in a promise
 */
export const putTransaction = async (db: DynamoDBDocumentClient, pkIds: BudgetParamGroup,
    skIds: TransactParamGroup, attrs: TransactAttrs) => {

    const partitionKey = reduceIds({
        userId: pkIds.userId,
        budgetId: pkIds.budgetId
    });
    const sortKey = reduceIds({
        userId: skIds.userId,
        budgetId: skIds.budgetId
    })

    let params = {
        TableName: constants.tableName,
        Item: createItem<TransactAttrs>(partitionKey, sortKey, attrs),
    };

    try {
        const data = await db.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
        return data;
    } catch (err) {
        console.log("Error with put: " + err);
        return "Error with put: " + err;
    }
}

export function helloDer (x: string): string {
    return "hello " + x;
}