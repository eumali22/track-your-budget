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

export function createAttrs(body: any, attrsDef: { [n: string]: AttrSpec }) {
  if (typeof body !== 'object') {
    throw new Error("Body parameter is not an object.");
  }
  if (!body) {
    throw new Error("Body parameter is " + body);
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

export const getProjectionExpr = (idGroup: IdGroup, ql: QueryLevel): string => {
  switch (idGroup.type) {
    case 'budgetId':
      return "SK, budget_name";
    case 'accountId':
      return ql === "all" ? "" : "SK, account_name";
    default:
      return "";
  }
}

// export const getFilterExpr = (idGroup: IdGroup, q: QueryLevel): string => {
//   switch (idGroup.type) {
//     case 'budgetId':
//       return "SK, budget_name";
    
//     default:
//       return "";
//   }
// }

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
  const mainId = info.idParams[info.type];
  const getAll = ((mainId === null || mainId === undefined) || mainId.trim() === "");
  
  let exprAttrVals;
  let keyCondExpr;
  
  if (getAll) {
    exprAttrVals = { ":pk": partitionKey };
    keyCondExpr = "PK = :pk";
  } else {
    exprAttrVals = { ":pk": partitionKey, ":sk": sortKey };
    keyCondExpr = "PK = :pk AND begins_with(SK, :sk)"
  }

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
  const projectionExpr = getProjectionExpr(info, ql);
  // const filterExpr = getFilterExpr(info, "first");

  let returnParams = params;
  if (projectionExpr) {
    returnParams = { ...returnParams, ProjectionExpression: projectionExpr };
  }
  // if (filterExpr) {
  //   returnParams = { ...returnParams, FilterExpression: filterExpr };
  // }

  return returnParams;
}