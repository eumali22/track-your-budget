
import { TybItem } from "../types/types";

export const constants = {
    delimiter: "#"
} as const;

export function createItem<T>(pk: string, sk: string, attrs: T): TybItem {
    let item: TybItem = {
        primaryKey: pk,
        sortKey: sk,
    };
    Object.keys(attrs).forEach((key) => {
        item[key] = attrs[key as keyof T];
    });

    return item;
}