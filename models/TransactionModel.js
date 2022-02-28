import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient.js";

// TO DO hardcoded for now
const USER_ID = "1";
const PFX_USER = "user_";

const paramsGetTransactions = {
    TableName: "TrackYourBudget",
    ExpressionAttributeValues: {
        ":a": PFX_USER + USER_ID,
        ":b": PFX_USER + USER_ID + "#acct_1#trans_",
    },
    ExpressionAttributeNames: {
        "#c": "value",
    },
    KeyConditionExpression: "PK = :a AND begins_with ( SK, :b )",
    ProjectionExpression: "SK, trans_date, #c, is_outflow",
};

export const getTransactions = async () => {
    try {
        const data = await ddbDocClient.send(new QueryCommand(paramsGetTransactions));
        // console.log("Success. Item details: ", data);
        // console.log("Success. Item details: ", data.Items);
        return data;
    } catch (err) {
        console.log("Error", err);
        return ["Error with data fetching: " + err];
    }
};

