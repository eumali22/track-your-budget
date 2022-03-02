"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.reduceIds = exports.ID_PREFIXES = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const ddbDocClient_js_1 = require("../libs/ddbDocClient.js");
const DELIM = "#";
exports.ID_PREFIXES = {
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
function reduceIds(ids) {
    return Object.keys(exports.ID_PREFIXES).reduce((prevVal, currVal) => {
        // return empty string if current id not part of query object
        if (!Object.keys(ids).includes(currVal)) {
            return prevVal;
        }
        // return empty string if initial call. no delimiter needed
        const d = (prevVal === '') ? '' : DELIM;
        const prefix = exports.ID_PREFIXES[currVal];
        const currId = filterId(ids[currVal]);
        return prevVal + d + prefix + currId;
    }, '');
}
exports.reduceIds = reduceIds;
function filterId(id) {
    return (['string', 'number'].includes(typeof id)) ? id : "";
}
/**
 * Fetches transactions from the database.
 * @param {string} transId the transaction id
 * @returns all transactions returned if transId is null or empty string. otherwise
 * returns a single transaction item with transaction id = transId.
 */
const getTransactions = (transId) => __awaiter(void 0, void 0, void 0, function* () {
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
        const data = yield ddbDocClient_js_1.ddbDocClient.send(new lib_dynamodb_1.QueryCommand(params));
        // console.log("Success. Item details: ", data);
        // console.log("Success. Item details: ", data.Items);
        return data;
    }
    catch (err) {
        console.log("Error", err);
        return ["Error with data fetching: " + err];
    }
});
exports.getTransactions = getTransactions;
