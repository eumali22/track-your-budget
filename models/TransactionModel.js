import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient.js";

// TO DO hardcoded for now
const CURR_USER = "user_1";


const params = {
    TableName: "TrackYourBudget",
    ExpressionAttributeValues: {
        ":a": CURR_USER,
        ":b": "user_1#acct_1#trans_",
    },
    ExpressionAttributeNames: {
        "#c": "value",
    },
    KeyConditionExpression: "PK = :a AND begins_with ( SK, :b )",
    ProjectionExpression: "SK, trans_date, #c, is_outflow",
};

export const getTransactions = async () => {
    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        console.log("Success. Item details: ", data);
        // console.log("Success. Item details: ", data.Items);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};