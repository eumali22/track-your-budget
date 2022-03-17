import express from "express";
import short from 'short-uuid';
import { constants } from "../lib/common"
import { getBudgets, putBudget } from "../models/budgetModel";
import { authMiddleware } from "../services/authService";
import { BudgetParamGroup, DbOperation } from "../types/types";
import { extractIds } from "./common";

export const router = express.Router();

export default function () {
    router.use(authMiddleware);

    router.post('/', async (req, res) => {
        try {
            const operation = req.body.budgetId ? "update" : "insert";
            const budgetParams = extractIds(constants.budgetIdKeys, "budgetId", req.body, operation);
            const data = await putBudget(budgetParams as BudgetParamGroup, req.body);
            res.status(200).json(data);
        } catch (err) {
            if (typeof err === 'string' && err.startsWith("Invalid body parameters")) {
                return res.status(400).json({ msg: err });
            }
            return res.status(500).json({ msg: err });
        }
    });

    router.get('/:userId/:budgetId?', async (req, res) => {
        // console.log(`req.params.userId: ${req.params.userId}`);
        // console.log(`req.params.budgetId: ${req.params.budgetId}`);

        try {
            const budgetParams = extractIds(constants.budgetIdKeys, "budgetId", req.params, "query");
            const data = await getBudgets(budgetParams as BudgetParamGroup);
            res.status(200).json(data);
        } catch (err) {
            if (typeof err === 'string' && err.startsWith("Invalid body parameters")) {
                return res.status(400).json({ msg: err });
            }
            return res.status(500).json({ msg: err });
        }
    });

    return router;
}

function getIdFromBody(propName: string, prop: string, isRequired: boolean): string {
    if (!prop) {
        if (propName === "budgetId") {
            return short.generate(); // random uuid for new records
        }
        if (isRequired) {
            throw `No ${propName} in request body!`;
        }
    }
    return prop;
}