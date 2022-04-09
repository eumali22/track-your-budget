import short from 'short-uuid';
import { constants } from '../lib/common';
import { AllIdKeys, DbOperation, ReqBody, XORParamGroups } from '../types/types';

export function extractIds<T extends AllIdKeys>(mainId: T, source: any, operation: DbOperation): XORParamGroups {
  const idKeys:AllIdKeys[] = constants[mainId + 'Keys'];
  
  const params = Object.fromEntries(
    idKeys.map(key => [key, computeId(mainId, key, source[key], operation)])
  );
  return params as XORParamGroups;
}

function computeId(mainId: string, propName: string, prop: string | null | undefined,
  operation: DbOperation): string {
  if (!prop) {
    if (propName === mainId) { // main Id can be null / undefined / empty
      switch (operation) {
        case 'query':
          return ""; // for query all
        case 'insert':
          return short.generate();
        case 'update':
          throw `No ${propName} in request source! (operation: update)`;
        default:
          throw `Invalid operation: ${operation}`;
      }
    } else {
      throw `No ${propName} in request source! (required)`;
    }
  } else {
    return prop;
  }
}