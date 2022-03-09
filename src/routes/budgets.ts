import express from "express";
import short from 'short-uuid';
import { constants } from "../libs/common"
import { putBudget } from "../models/budgetModel";
import { BudgetParamGroup } from "../types/types";

export const router = express.Router();

export default function () {
    router.post('/', async (req, res) => {
        try {
            const budgetParams = Object.fromEntries(
                constants.budgetIdKeys.map(key => [key, getIdFromBody(key, req.body[key], true)])
            );
            const data = await putBudget(budgetParams as BudgetParamGroup, req.body);
            res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({ msg: "Error encountered: " + err, Count: 0 });
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