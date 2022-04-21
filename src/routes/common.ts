import short from 'short-uuid';
import { constants } from '../lib/common';
import { KeySet } from '../models/common';
import { AllIdKeys, DbOperation, ReqBody, XORParamGroups } from '../types/types';

/**
 * Called by routers to extract id from request body.
 * @param mainId must be one of: "userId", "budgetId", "accountId", "transactionId"
 * @param source request body passed here and type is `any`. function will validate this
 * @param operation must be one of: "query", "insert", "update"
 * @returns an object with the ids required (type XORParamGroups)
 */
export function extractIds<T extends XORParamGroups>(mainId: AllIdKeys, source: any, operation: DbOperation): T {
  const idKeys:AllIdKeys[] = constants[mainId + 'Keys'];
  
  const params = Object.fromEntries(
    idKeys.map(key => [key, computeId(mainId, key, source[key], operation)])
  );
  return params as T;
}

function computeId(mainId: AllIdKeys, propName: string, prop: string | null | undefined, operation: DbOperation): string {
  if (!prop || prop.trim() === "") {
    if (propName === mainId) { // main Id can be null / undefined / empty
      switch (operation) {
        case 'query':
          return ""; // for query all
        case 'insert':
          return short.generate();
        case 'update':
          throw new Error(`Missing id in source: ${propName} (operation: update)`);
        default:
          throw new Error(`Invalid operation: ${operation}`);
      }
    } else {
      throw new Error(`Missing id in source: ${propName} (required)`);
    }
  } else {
    return prop;
  }
}

export async function handlePost<T extends XORParamGroups>(mainId: AllIdKeys, body: ReqBody, res: any, process: (x: T, y: ReqBody) => Promise<KeySet>) {
  try {
    const operation = body[mainId] ? "update" : "insert";
    const idParams = extractIds<T>(mainId, body, operation);
    const data = await process(idParams, body);
    res.status(200).json(data);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
      if (err.message.startsWith("Missing id in source")) {
        return res.status(400).json({ msg: err.message });  
      }
      return res.status(500).json({ msg: err.message });
    }
    return res.status(500).json({ msg: err });
  }
}
