declare type UserIdParameter = {
    userId: string | number;
};
declare type BudgetIdParameter = {
    budgetId: string | number | null;
} & UserIdParameter;
declare type AccountIdParameter = {
    accountId: string | number | null;
} & BudgetIdParameter;
declare type TransactionIdParameter = {
    transactionId: string | number | null;
} & AccountIdParameter;
declare type IdParameter = UserIdParameter | BudgetIdParameter | AccountIdParameter | TransactionIdParameter;
