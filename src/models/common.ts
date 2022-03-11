
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { BudgetAttrs, IdGroup, TransactAttrs, TybItem, XORParamGroups } from "../types/types";
import { ddbDocClient as db } from "../libs/ddbDocClient";
import { constants, idPrefixes } from "../libs/common"

type AttrSpec = {
    type: string;
    required: boolean;
}

export const budgetAttrs: Record<keyof BudgetAttrs, AttrSpec> = {
    "budget_name": { type: "string", required: true },
} as const;

export const transactionAttrs: Record<keyof TransactAttrs, AttrSpec> = {
    "is_start_bal": {type: "boolean", required: true}, 
    "is_outflow": {type: "boolean", required: true},
    "category": {type: "string", required: false},
    "trans_date": {type: "string", required: true},
    "memo": {type: "string", required: false},
    "value": {type: "number", required: true}
} as const;


export function reduceIds(ids: XORParamGroups, maxReduction?: number): string {
    // if (typeof ids !== 'object') return "";

    return constants.idKeys.reduce((prevVal, currVal, index) => {
        // return prevVal if current id not part of query object
        // return preVal if maxReduction reached
        if (!Object.keys(ids).includes(currVal)) {
            return prevVal;
        }
        if (maxReduction && index >= maxReduction) {
            return prevVal;
        }
        const d = (prevVal === '') ? '' : constants.delimiter;
        const prefix = idPrefixes[currVal];
        const currId = filterId(ids[currVal]);
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

export function createAttrs(body: any, attrsDef: {[n: string]: AttrSpec}) {
    if (typeof body !== 'object') {
        throw "Body parameter is not an object.";
    }
    if (!body) {
        throw "Body parameter is " + body;
    }

    const attrsFromBody = Object.fromEntries(Object.entries(attrsDef)
        .map(([k, v]) => [k, body[k], v.type])
        .filter(n => n[1] !== undefined && n[1] !== null)
        .filter(n => typeof n[1] === n[2]));
    
    const requiredAttrs = Object.entries(attrsDef)
        .filter(([k, v]) => v.required)
        .map(([k, v]) => k);

    const hasAllRequiredAttrs = requiredAttrs.reduce((pv, cv) => {
        return pv && attrsFromBody.hasOwnProperty(cv);
    }, true);
    
    if (hasAllRequiredAttrs) {
        return attrsFromBody;
    } else {
        const msg = "Invalid body parameters. Required attributes missing/wrong data types. Required attrs: "
            + requiredAttrs;
        // console.error(msg);
        throw msg;
    }
}

export const generatePk = (idGroup: IdGroup): string => {
    if (['userId', 'budgetId'].includes(idGroup.type)) { 
        const idVal = idGroup.idParams[idGroup.type];
        // if there is a passed id, ignore/remove it
        if (idVal !== null && idVal !== "") {
            return reduceIds(idGroup.idParams, 2).slice(0, idVal!.length * -1);
        }  
    }
    return reduceIds(idGroup.idParams, 2);
}

export const generateSk = (idGroup: IdGroup): string => {
    let userId = idGroup.idParams.userId
    if (userId === null || userId.trim() === "") {
        throw "userId not specified."
    }
    return reduceIds(idGroup.idParams);
}

export const putItem = async <T>(info: IdGroup, attrs: T): Promise<string | {PK: string, SK: string}> => {
    const partitionKey = generatePk(info);
    const sortKey = generateSk(info);
    const params = {
        TableName: constants.tableName,
        Item: createItem<T>(partitionKey, sortKey, attrs),
    };

    try {
        const data = await db.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
        return { PK: partitionKey, SK: sortKey };
    } catch (err) {
        // console.error("Error with put: " + err);
        return "Error with put: " + err;
    }
}