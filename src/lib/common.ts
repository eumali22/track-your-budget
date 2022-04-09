import { AllIdKeys, AllParamGroup } from "../types/types";

const idKeys: AllIdKeys[] = ["userId", "budgetId", "accountId", "transactionId"];

type Constants = {
  idKeys: AllIdKeys[],
  [key: string]: any
}

export const constants: Constants = {
    delimiter: "#",
    tableName: "TrackYourBudget",
    idKeys: idKeys,
    userIdKeys: idKeys.slice(0, 1),
    budgetIdKeys: idKeys.slice(0, 2),
    accountIdKeys: idKeys.slice(0, 3),
    transactionIdKeys: idKeys.slice(0, 4)
};

export const idPrefixes: Record<AllIdKeys, string> = {
    userId: "user_",
    budgetId: "budget_",
    accountId: "acct_",
    transactionId: "trans_",
} as const;