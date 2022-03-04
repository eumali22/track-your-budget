import { XOR } from "ts-xor"

declare type _RemoveNull<T> = {
    [P in keyof T] : string | number;
}

declare type UserIdParam = {
    userId: string | number;
}

declare type BudgetIdParam = UserIdParam & {
    budgetId: string | number | null;
}

declare type AccountIdParam = _RemoveNull<BudgetIdParam> & {
    accountId: string | number | null;
}

declare type TransIdParam = _RemoveNull<AccountIdParam> & {
    transactionId: string | number | null;
}

export declare type IdsParam = XOR<XOR<XOR<UserIdParam, BudgetIdParam>, AccountIdParam>, TransIdParam>;