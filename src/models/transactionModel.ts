import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient";
import { constants } from "../libs/common"
import { ParamGroupAll, AllIdKeys, XORParamGroups } from "../types/types";

export const idPrefixes: Readonly<ParamGroupAll> = {
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
    if (typeof ids !== 'object') return "";

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

function createPKParamGroup() {

}

function createSKParamGroup() {

}

/**
 * Fetches transactions from the database.
 * @param {string} transId the transaction id
 * @returns all transactions returned if transId is null or empty string. otherwise
 * returns a single transaction item with transaction id = transId.
 */
export const getTransactions = async (transId: string | null) => {
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
        const data = await ddbDocClient.send(new QueryCommand(params));
        console.log("Fetch success: " + data);
        return data;
    } catch (err) {
        console.log("Error fetching: " + err);
        return "Error fetching: " + err;
    }
};


export const upsertTransaction = async (ids: any) => {
    let params = {
        TableName: "TrackYourBudget",
        /*
          Convert the key JavaScript object you are adding to the
          required Amazon DynamoDB record. The format of values specifies
          the datatype. The following list demonstrates different
          datatype formatting requirements:
          String: "String",
          NumAttribute: 1,
          BoolAttribute: true,
          ListAttribute: [1, "two", false],
          MapAttribute: { foo: "bar" },
          NullAttribute: null
           */
        Item: {
            primaryKey: reduceIds({
                userId: ids.userId as string,
                budgetId: ids.budgetId as string
            }),
            sortKey: '',
            NEW_ATTRIBUTE_1: "NEW_ATTRIBUTE_1_VALUE", //For example 'Title': 'The Beginning'
        },
    };

    // try {
    //     const data = await ddbDocClient.send(new PutCommand());
    // }
}