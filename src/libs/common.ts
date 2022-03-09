import { AllIdKeys, AllParamGroup } from "../types/types";

const idKeys: AllIdKeys[] = ["userId", "budgetId", "accountId", "transactionId"];

export const constants = {
    delimiter: "#",
    tableName: "TrackYourBudget",
    idKeys: idKeys,
    userIdKeys: idKeys.slice(0, 1),
    budgetIdKeys: idKeys.slice(0, 2),
    accountIdKeys: idKeys.slice(0, 3),
    transactionIdKeys: idKeys.slice(0, 4)
} as const;

export const idPrefixes: AllParamGroup = {
    userId: "user_",
    budgetId: "budget_",
    accountId: "acct_",
    transactionId: "trans_",
} as const;