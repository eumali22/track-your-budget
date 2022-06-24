import { PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { AccountAttrs, BudgetAttrs, IdGroup, TransactAttrs, TybItem, XORParamGroups } from "../types/types";
import { ddbDocClient as db } from "../lib/ddbDocClient";
import { constants, idPrefixes } from "../lib/common"

type AttrSpec = {
  type: string;
  required: boolean;
}

export namespace Attributes {
  export const budgetAttrs: Record<keyof BudgetAttrs, AttrSpec> = {
    "budget_name": { type: "string", required: true },
  };

  export const accountAttrs: Record<keyof AccountAttrs, AttrSpec> = {
    "account_name": { type: "string", required: true },
  };

  export const transactionAttrs: Record<keyof TransactAttrs, AttrSpec> = {
    "is_start_bal": { type: "boolean", required: true },
    "is_outflow": { type: "boolean", required: true },
    "category": { type: "string", required: false },
    "trans_date": { type: "string", required: true },
    "memo": { type: "string", required: false },
    "value": { type: "number", required: true }
  };
}

export function reduceIds(ids: XORParamGroups, maxReduction?: number): string {
  // if (typeof ids !== 'object') return "";

  return constants.idKeys.reduce((prevVal, currVal, index) => {
    // return prevVal if current id not part of query object
    // return prevVal if maxReduction reached
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

/**
 * tests if s contains only digits or is empty. no trim
 * @param s string. empty string accepted
 * @returns empty string returns true
 */
export const containsDigitsOnly = (s: string) => [...s].every(c => '0123456789'.includes(c));

/**
 * Accepted number format is XXX<separator>XXX. Strict checking -- no trim calls inside function.
 * @param str the string to check.
 * @param separator defaults to '.'.
 * @returns true if format of str is XXX<separator>XXX.
 */
export function isValidNumberFormat(str: string, separator:string = '.'): boolean {
  const split = str.split(separator);
  return split.every(containsDigitsOnly);
}

export function convertToType(data: [string, string, 'boolean' | 'number' | 'string'][]) {
  return data.map(([name, value, type]) => {
    switch (type) {
      case 'boolean':
        if (value.toLowerCase().trim() === 'true') return [name, true];
        if (value.toLowerCase().trim() === 'false') return [name, false];
        throw new Error('Unparsable boolean');
      case 'number':
        if (isValidNumberFormat(value)) return [name, parseFloat(value)];
        throw new Error("Unparsable number");
      default:
        return [name, value];
    }
  });
}

export function getAttributesFromBody(body: any, attrsDef: { [n: string]: AttrSpec }) {
  return Object.fromEntries(Object.entries(attrsDef)
    .map(([k, v]) => [k, body[k], v.type])
    .filter(n => n[1] !== undefined && n[1] !== null)
    .map(([name, value, type]) => {
      if (typeof value === type) return [name, value];
      if (typeof value !== 'string') throw new Error(`Invalid body parameters: string expected, got ${typeof value}`);
      switch (type) {
        case 'boolean':
          if (value.toLowerCase().trim() === 'true') return [name, true];
          if (value.toLowerCase().trim() === 'false') return [name, false];
          throw new Error('Unparsable boolean');
        case 'number':
          if (isValidNumberFormat(value)) return [name, parseFloat(value)];
          throw new Error("Unparsable number");
        default:
          return [name, value];
      }
    }));
}

export function createAttrs(body: any, attrsDef: { [n: string]: AttrSpec }) {
  if (typeof body !== 'object') {
    throw new Error("Body parameter is not an object.");
  }
  if (!body) {
    throw new Error("Body parameter is " + body);
  }

  console.log(`body:\n ${body}`);
  console.log(`attrsDef:\n ${attrsDef}`);

  const attrsFromBody = getAttributesFromBody(body, attrsDef);
  console.log(`attrsFromBody:\n ${attrsFromBody}`);

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
    throw new Error(msg);
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

export const getExprAttrNames = (idGroup: IdGroup) => {
  switch (idGroup.type) {
    case 'transactionId':
      return {
        "#value": "value",
      };
    default:
      return null;
  }
}

export const getProjectionExpr = (idGroup: IdGroup, ql: QueryLevel): string => {
  switch (idGroup.type) {
    case 'budgetId':
      return "SK, budget_name";
    case 'accountId':
      return ql === "all" ? "" : "SK, account_name";
    case 'transactionId':
      return "SK, trans_date, #value, is_outflow";
    default:
      return "";
  }
}

export const getExpressionAttributeValues = (idGroup: IdGroup, pk: string, sk: string) => {
  switch (idGroup.type) {
    case 'budgetId':
      const idVal = idGroup.idParams[idGroup.type];
      return idVal ? { ":pk": pk, ":sk": sk } : { ":pk": pk };
    default:
      return { ":pk": pk, ":sk": sk };
  }
}

export const getKeyConditionExpression = (idGroup: IdGroup) => {
  switch (idGroup.type) {
    case 'budgetId':
      const idVal = idGroup.idParams[idGroup.type];
      return idVal ? "PK = :pk AND begins_with(SK, :sk)" : "PK = :pk";
    default:
      return "PK = :pk AND begins_with(SK, :sk)";
  }
}


export type KeySet = { PK: string, SK: string };
export type QueryLevel = "all" | "first";

export const putItem = async <T>(info: IdGroup, attrs: T): Promise<KeySet> => {
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
    throw new Error("Error with put: " + err);
  }
}

export const getItems = async (info: IdGroup, ql: QueryLevel): Promise<any> => {
  const partitionKey = generatePk(info);
  const sortKey = generateSk(info);
  const mainIdVal = info.idParams[info.type];

  // const getOneItemOnly = (mainIdVal !== null && mainIdVal !== undefined && mainIdVal.trim() !== "");
  // console.log(`mainIdVal: "${mainIdVal}"`);
  // console.log(`get one item only? ${getOneItemOnly}`);
  // console.log(`PK ${partitionKey}`);
  // console.log(`SK ${sortKey}`);
  
  let exprAttrVals = getExpressionAttributeValues(info, partitionKey, sortKey);
  let keyCondExpr = getKeyConditionExpression(info);
  
  // console.log(`Key Condition Expression: ${keyCondExpr}`);
  
  const params = buildQuery({
    TableName: constants.tableName,
    ExpressionAttributeValues: exprAttrVals,
    KeyConditionExpression: keyCondExpr,
  }, info, ql);

  try {
    const data = await db.send(new QueryCommand(params));
    return data.Items;
  } catch (err) {
    console.log(err);
    throw new Error("Error fetching: " + err);
  }
}

const buildQuery = (params: QueryCommandInput, info: IdGroup, ql: QueryLevel): QueryCommandInput => {
  const exprAttrNames = getExprAttrNames(info);
  const projectionExpr = getProjectionExpr(info, ql);

  let returnParams = params;
  if (projectionExpr) {
    returnParams = { ...returnParams, ProjectionExpression: projectionExpr };
  }
  if (exprAttrNames) {
    returnParams = { ...returnParams, ExpressionAttributeNames: exprAttrNames };
  }

  return returnParams;
}