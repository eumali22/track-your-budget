import { QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient";

const DELIM = "#";

export type IdGroupParam = {
    userId: string | number;
    budgetId?: string | number;
    accountId?: string | number;
    transactionId?: string | number;
}

export type IdKey = keyof IdGroupParam;


export const ID_PREFIXES: IdGroupParam = {
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
 * @param {Object} ids Object that holds the ids to query. Uses the same property names
 * as ID_PREFIXES.
 * @example
 * const sortKey = reduceIds({
 *     "userId": 29554,
 *     "budgetId": 4,
 *     "accountId": 5,
 *     "transactionId": null,
 * });
 * @returns a string to be used as partition key or sort key.
 */
export function reduceIds(ids: IdGroupParam) {
    return Object.keys(ID_PREFIXES).reduce((prevVal, currVal) => {
        // return empty string if current id not part of query object
        if (!Object.keys(ids).includes(currVal)) {
            return prevVal;
        }

        // return empty string if initial call. no delimiter needed
        const d = (prevVal === '') ? '' : DELIM;
        const prefix = ID_PREFIXES[currVal as IdKey];
        const currId = filterId(ids[currVal as keyof IdGroupParam]);
        return prevVal + d + prefix + currId;
    }, '');
}


function filterId(id: any) {
    return (['string', 'number'].includes(typeof id)) ? id : "";
}


/**
 * Fetches transactions from the database.
 * @param {string} transId the transaction id
 * @returns all transactions returned if transId is null or empty string. otherwise
 * returns a single transaction item with transaction id = transId.
 */
export const getTransactions = async (transId: any) => {
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
        console.log("Error fetching: ", err);
        let data = { Items: [{error: err}] };
        return data;
    }
};

