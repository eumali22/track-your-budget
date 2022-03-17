import short from 'short-uuid';
import { DbOperation, TransactIdKeys, XORParamGroups } from '../types/types';

export const extractIds = (idKeys: TransactIdKeys[], mainId: string, source: any, operation: DbOperation): XORParamGroups => {
    const params = Object.fromEntries(
        idKeys.map(key => [key, computeId(mainId, key, source[key], true, operation)])
    );
    return params as XORParamGroups;
}

function computeId(mainId: string, propName: string, prop: string, isRequired: boolean,
    operation: DbOperation): string {
    if (!prop) {
        if (propName === mainId) {
            switch (operation) {
                case 'query':
                    return ""; // for query all
                case 'insert':
                    return short.generate();
                case 'update':
                    throw `No ${propName} in request source! Operation: update`;
                default:
                    return "";
            }
        }
        if (isRequired) {
            throw `No ${propName} in request source! Required`;
        }
    }
    return prop;
}