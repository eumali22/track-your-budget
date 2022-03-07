
import { AllIdKeys, AllParamGroup, TybItem, XORParamGroups } from "../types/types";

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

