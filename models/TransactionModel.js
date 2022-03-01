import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient.js";

const PFX_USER = "user_";
const PFX_ACCT = "acct_";
const PFX_TRANS = "trans_";
const DELIM = "#";

// TO DO hardcoded for now
const USER_ID = "1";
const USER_ACCT = "1";

export function buildSortKey(userId, acctId, transId) {
    let sk = "";
    if (userId !== undefined) {
        sk = PFX_USER + userId;
        if (acctId !== undefined) {
            sk += DELIM + PFX_ACCT + acctId;
            if (transId !== undefined) {
                sk += DELIM + PFX_TRANS + transId;
            }
        }
    }
    return sk;
}

export const getTransactions = async (transId) => {
    const params = {
        TableName: "TrackYourBudget",
        ExpressionAttributeValues: {
            ":user": PFX_USER + USER_ID,
            ":sort_key": buildSortKey(USER_ID, USER_ACCT, transId === undefined ? '' : transId),
        },
        ExpressionAttributeNames: {
            "#value": "value",
        },
        KeyConditionExpression: "PK = :user AND begins_with ( SK, :sort_key )",
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

