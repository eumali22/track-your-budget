import { XOR } from "ts-xor";

export type DbOperation = "query" | "insert" | "update";

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
    account_name: string;
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
    PK: string;
    SK: string;
}

export class IdGroup {
    readonly type: AllIdKeys;
    readonly idParams: XORParamGroups;

    constructor(t: AllIdKeys, idParams: XORParamGroups) {
        this.type = t;
        this.idParams = idParams;
        if (!this.validate()) {
            throw "invalid parameters"
        }
    }

    private validate() {
        // check if idParams has extra ids / has missing ids
        let hasExtraIds = false;
        let hasMissingIds = false;
        switch (this.type) {
            case "userId":
                hasExtraIds = this.idParams.hasOwnProperty("budgetId") ||
                    this.idParams.hasOwnProperty("accountId") ||
                    this.idParams.hasOwnProperty("transactionId");
                hasMissingIds = !this.idParams.hasOwnProperty("userId");
                break;
            case "budgetId": 
                hasExtraIds = this.idParams.hasOwnProperty("accountId") ||
                    this.idParams.hasOwnProperty("transactionId");
                hasMissingIds = !this.idParams.hasOwnProperty("userId") ||
                    !this.idParams.hasOwnProperty("budgetId");
                break;
            case "accountId":
                hasExtraIds = this.idParams.hasOwnProperty("transactionId");
                hasMissingIds = !this.idParams.hasOwnProperty("userId") ||
                    !this.idParams.hasOwnProperty("budgetId") ||
                    !this.idParams.hasOwnProperty("accountId");
                break;
            case "transactionId":
                hasExtraIds = false;
                hasMissingIds = !this.idParams.hasOwnProperty("userId") ||
                    !this.idParams.hasOwnProperty("budgetId") ||
                    !this.idParams.hasOwnProperty("accountId") ||
                    !this.idParams.hasOwnProperty("transactionId");
                break;
        }

        return !hasExtraIds && !hasMissingIds;
    }
}