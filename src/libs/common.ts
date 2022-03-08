
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { XOR } from "ts-xor";
import { AllIdKeys, AllParamGroup, TransactAttrs, TybItem, XORParamGroups } from "../types/types";
import { ddbDocClient as db } from "./ddbDocClient";

export const constants = {
    delimiter: "#",
    tableName: "TrackYourBudget",
} as const;

export const idPrefixes: AllParamGroup = {
    userId: "user_",
    budgetId: "budget_",
    accountId: "acct_",
    transactionId: "trans_",
} as const;

export const transactionAttrs = {
    "is_start_bal": {type: "boolean", required: true}, 
    "is_outflow": {type: "boolean", required: true},
    "category": {type: "string", required: false},
    "trans_date": {type: "string", required: true},
    "memo": {type: "string", required: false},
    "value": {type: "number", required: true}
} as const;


export function reduceIds(ids: XORParamGroups, maxReduction?: number): string {
    // if (typeof ids !== 'object') return "";

    return Object.keys(idPrefixes).reduce((prevVal, currVal, index) => {
        // return prevVal if current id not part of query object
        // return preVal if maxReduction reached
        if (!Object.keys(ids).includes(currVal)) {
            return prevVal;
        }
        if (maxReduction && index >= maxReduction) {
            return prevVal;
        }
        const d = (prevVal === '') ? '' : constants.delimiter;
        const prefix = idPrefixes[currVal as AllIdKeys];
        const currId = filterId(ids[currVal as AllIdKeys]);
        return prevVal + d + prefix + currId;
    }, '');
}

export function filterId(id: string | null | undefined) {
    return (['string', 'number'].includes(typeof id)) ? id : "";
}

export function createItem<T>(pk: string, sk: string, attrs: T): TybItem {
    let item: TybItem = {
        PK: pk,
        SK: sk,
    };
    Object.keys(attrs).forEach((key) => {
        item[key] = attrs[key as keyof T];
    });

    return item;
}

export function createAttrs(body: any): TransactAttrs {
    if (typeof body !== 'object') {
        throw "Body parameter is not an object.";
    }
    if (!body) {
        throw "Body parameter is " + body;
    }

    const attrs = Object.fromEntries(Object.entries(transactionAttrs)
        .map(([k, v]) => [k, body[k], v.type])
        .filter(n => n[1] !== undefined && n[1] !== null)
        .filter(n => typeof n[1] === n[2]));
    
    const requiredAttrs = Object.entries(transactionAttrs)
        .filter(([k, v]) => v.required)
        .map(([k, v]) => k);

    const hasAllRequiredAttrs = requiredAttrs.reduce((pv, cv) => {
        return pv && attrs.hasOwnProperty(cv);
    }, true);

    if (hasAllRequiredAttrs) {
        return attrs;
    } else {
        throw "Invalid body parameters. Required attributes missing/wrong data types.";
    }
}

export const generatePk = (info: XORParamGroups, idKey: AllIdKeys): string => {
    if (['userId', 'budgetId'].includes(idKey)) { 
        // if there is a passed id, ignore/remove it
        if (info[idKey] !== null && info[idKey] !== "") {
            return reduceIds(info, 2).slice(0, info[idKey]!.length * -1);
        }  
    }
    return reduceIds(info, 2);
}

export const putItem = async <T extends XORParamGroups, U>(info: T, attrs: U): Promise<string | {id: string}> => {

    const partitionKey = reduceIds(info);
    const sortKey = reduceIds(info);
    const params = {
        TableName: constants.tableName,
        Item: createItem<U>(partitionKey, sortKey, attrs),
    };

    try {
        const data = await db.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
        return { id: "" }; // TO DO fix
    } catch (err) {
        console.log("Error with put: " + err);
        return "Error with put: " + err;
    }
}