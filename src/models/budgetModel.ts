import { putItem, createAttrs, Attributes, getItems } from "./common";
import { BudgetAttrs, BudgetParamGroup, IdGroup } from "../types/types";

export const getBudgets = async (budgetParams: BudgetParamGroup) => {
  const budgetIdGroup = new IdGroup("budgetId", budgetParams);
  return getItems(budgetIdGroup, "all");
}

export const putBudget = async (budget: BudgetParamGroup, body: any) => {
  const attrs: BudgetAttrs = createAttrs(body, Attributes.budgetAttrs);
  return putItem<BudgetAttrs>(new IdGroup("budgetId", budget), attrs);
}
