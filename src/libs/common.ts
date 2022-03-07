
import { AllIdKeys, AllParamGroup, TransactAttrs, TybItem, XORParamGroups } from "../types/types";

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
};


/**
 * Builds a key (partition or sort key) using the ids parameter.
 * @param {XORParamGroups} ids Object that holds the ids to query.
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
    // if (typeof ids !== 'object') return "";

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