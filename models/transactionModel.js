import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient.js";

const PFX_USER = "user_";
const PFX_BUDGET = "budget_";
const PFX_ACCT = "acct_";
const PFX_TRANS = "trans_";
const DELIM = "#";

const ID_PREFIXES = {
    "userId" : "user_",
    "budgetId" : "budget_",
    "accountId" : "acct_",
    "transactionId" : "trans_",
}

// TO DO hardcoded for now
const USER_ID = "1";
const BUDGET_ID = "1";
const ACCT_ID = "1";

export function buildSortKey(userId, budgetId, acctId, transId) {
    let sk = "";
    if (userId !== undefined) {
        sk = PFX_USER + userId;
        if (budgetId !== undefined) {
            sk += DELIM + PFX_BUDGET
                + (budgetId === null || budgetId === false ? '' : budgetId);
            if (acctId !== undefined) {
                sk += DELIM + PFX_ACCT
                    + (acctId === null || acctId === false ? '' : acctId);
                if (transId !== undefined) {
                    sk += DELIM + PFX_TRANS
                        + (transId === null || transId === false ? '' : transId);
                }
            }
        }
        
    }

    return sk;
}

export function reduceIds(ids) {
    return Object.keys(ID_PREFIXES).reduce((prevVal, currVal) => {
        const prefix = ID_PREFIXES[currVal];
        const currId = (ids[currVal] === null || ids[currVal] === false) ? '' : ids[currVal];
        return ((prevVal === 0) ? '' : prevVal + DELIM) + prefix + currId;
    }, 0);
}

/**
 * 
 * @param {string} transId the transaction id
 * @returns all transactions returned if transId is null or empty string. otherwise
 * returns a single transaction item with the given transId.
 */
export const getTransactions = async (transId) => {
    let params = {
        TableName: "TrackYourBudget",
        ExpressionAttributeValues: {
            ":pk": PFX_USER + USER_ID + DELIM + PFX_BUDGET + BUDGET_ID,
            ":sk": buildSortKey(USER_ID, BUDGET_ID, ACCT_ID, transId),
        },
        ExpressionAttributeNames: {
            "#value": "value",
        },
        KeyConditionExpression: "PK = :pk AND begins_with ( SK, :sk )",
        ProjectionExpression: "SK, trans_date, #value, is_outflow",
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        // console.log("Success. Item details: ", data);
        // console.log("Success. Item details: ", data.Items);
        return data;
    } catch (err) {
        console.log("Error", err);
        return ["Error with data fetching: " + err];
    }
};

