import { QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient";
import { constants } from "../libs/common"
import type { IdsParam } from "../types";

export type IdKey = keyof IdsParam;

export const ID_PREFIXES: Readonly<IdsParam> = {
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
 * @param {IdGroupParam} ids Object that holds the ids to query.
 * @example
 * const sortKey = reduceIds({
 *     "userId": 29554,
 *     "budgetId": 4,
 *     "accountId": 5,
 *     "transactionId": "",
 * });
 * @returns a string to be used as partition key or sort key.
 */
export function reduceIds(ids: IdsParam): string {
    return Object.keys(ID_PREFIXES).reduce((prevVal, currVal) => {
        // return empty string if current id not part of query object
        if (!Object.keys(ids).includes(currVal)) {
            return prevVal;
        }
        const d = (prevVal === '') ? '' : constants.delimiter;
        const prefix = ID_PREFIXES[currVal as IdKey];
        const currId = filterId(ids[currVal as IdKey]);
        return prevVal + d + prefix + currId;
    }, '');
}


export function filterId(id: string | number | any) {
    if (typeof id === 'number' && isNaN(id)) {
        return '';
    }
    if (typeof id === 'number' && !isFinite(id)) {
        return '';
    }
    return (['string', 'number'].includes(typeof id)) ? id : "";
}


/**
 * Fetches transactions from the database.
 * @param {string} transId the transaction id
 * @returns all transactions returned if transId is null or empty string. otherwise
 * returns a single transaction item with transaction id = transId.
 */
export const getTransactions = async (transId: string | null): Promise<QueryCommandOutput | string> => {
    let params = {
        TableName: "TrackYourBudget",
        ExpressionAttributeValues: {
            ":pk": reduceIds({
                "userId": USER_ID,
                "budgetId": BUDGET_ID,
            }),
            ":sk": reduceIds({
                "userId": USER_ID,
                "budgetId": BUDGET_ID,
                "accountId": ACCT_ID,
                "transactionId": transId,
            }),
        },
        ExpressionAttributeNames: {
            "#value": "value",
        },
        KeyConditionExpression: "PK = :pk AND begins_with ( SK, :sk )",
        ProjectionExpression: "SK, trans_date, #value, is_outflow",
    };

    try {
        const data: QueryCommandOutput = await ddbDocClient.send(new QueryCommand(params));
        console.log("Fetch success: " + data);
        return data;
    } catch (err) {
        console.log("Error fetching: " + err);
        return "Error fetching: " + err;
    }
};

