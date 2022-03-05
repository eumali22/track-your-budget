import { XOR } from "ts-xor";

export type UserIdKeys = "userId";
export type BudgetIdKeys = UserIdKeys | "budgetId";
export type AccountIdKeys = BudgetIdKeys | "accountId";
export type TransactIdKeys = AccountIdKeys | "transactionId";

export type UserParamGroup = ParamGroup<UserIdKeys, "userId">;
export type BudgetParamGroup = ParamGroup<BudgetIdKeys, "budgetId">;
export type AccountParamGroup = ParamGroup<AccountIdKeys, "accountId">;
export type TransactParamGroup = ParamGroup<TransactIdKeys, "transactionId">;

// added for readability
export type AllIdKeys = TransactIdKeys;
export type AllParamGroup = TransactParamGroup;

export type ParamGroup<T extends AllIdKeys, N extends AllIdKeys> = {
    [P in T]: P extends N ? (string | null) : string;
};

export type XORParamGroups =
    XOR<XOR<XOR<UserParamGroup, BudgetParamGroup>, AccountParamGroup>, TransactParamGroup>;


export type BudgetAttrs = {
    budget_name: string;
}

export type AccountAttrs = {
    acount_name: string;
}

export type TransactAttrs = {
    is_start_bal: boolean;
    is_outflow: boolean;
    category?: string;
    trans_date: string;
    memo?: string;
    value: number;
}

export interface TybItem extends Record<string, any> {
    primaryKey: string;
    sortKey: string;
}