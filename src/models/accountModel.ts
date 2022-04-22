import { AccountAttrs, AccountParamGroup, IdGroup } from "../types/types";
import { Attributes, createAttrs, getItems, putItem } from "./common";

export const getAccountsSet = async (acctParams: AccountParamGroup) => {
  const acctIdGroup = new IdGroup("accountId", acctParams);
  return getItems(acctIdGroup, "all");
}

export const getAccountsOnly = async (acctParams: AccountParamGroup) => {
  const acctIdGroup = new IdGroup("accountId", acctParams);
  return getItems(acctIdGroup, "first");
}

export const putAccount = async (accParams: AccountParamGroup, body: any) => {
  const attrs: AccountAttrs = createAttrs(body, Attributes.accountAttrs);
  return putItem<AccountAttrs>(new IdGroup("accountId", accParams), attrs);
}