import { XOR } from "ts-xor";

type UserIdKeys = "userId";
type BudgetIdKeys = UserIdKeys | "budgetId";
type AccountIdKeys = BudgetIdKeys | "accountId";
type TransactIdKeys = AccountIdKeys | "transactionId";

// added for readability
export type AllIdKeys = TransactIdKeys;

export type ParamGroupAll = ParamGroup<TransactIdKeys, "transactionId">;

export type ParamGroup<T extends AllIdKeys, N extends AllIdKeys> = {
    [P in T]: P extends N ? (string | null) : string;
};

export type XORParamGroups =
    XOR<XOR<XOR<
        ParamGroup<UserIdKeys, "userId">,
        ParamGroup<BudgetIdKeys, "budgetId">>, 
        ParamGroup<AccountIdKeys, "accountId">>,
        ParamGroup<TransactIdKeys, "transactionId">>;
