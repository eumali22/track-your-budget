import express from "express";
import { checkAccessToken, checkIdToken } from "../services/authService"

export const router = express.Router();

export default function () {
    router.post('/access', async (req, res) => {
        try {
            //const data = await putBudget(budgetParams as BudgetParamGroup, req.body);
            const payload = await checkAccessToken(req.body.token);
            if (payload) {
                res.status(200).json(payload);
            } else {
                res.status(406).json({});
            }
            
        } catch (err) {
            return res.status(500).json({ msg: "Error encountered: " + err, Count: 0 });
        }
    });

    router.post('/id', async (req, res) => {
        try {
            //const data = await putBudget(budgetParams as BudgetParamGroup, req.body);
            const payload = await checkIdToken(req.body.token);
            if (payload) {
                res.status(200).json(payload);
            } else {
                res.status(406).json({});
            }

        } catch (err) {
            return res.status(500).json({ msg: "Error encountered: " + err, Count: 0 });
        }
    });

    return router;
}