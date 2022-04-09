import express from "express";
import { constants } from "../lib/common"
import { getBudgets, putBudget } from "../models/budgetModel";
import { authMiddleware } from "../services/authService";
import { BudgetParamGroup, ReqBody } from "../types/types";
import { extractIds } from "./common";

export const router = express.Router();

export default function () {
  if (process.env.DEV_BYPASS_AUTH !== '1') router.use(authMiddleware);

  // expect req defined since we use body-parser middleware
  router.post('/', async (req, res) => { handlePost(req.body, res); });
  router.get('/:userId/:budgetId?', handleGet);
  return router;
}

export async function handlePost(body: ReqBody, res: any) {
  try {
    const operation = body.budgetId ? "update" : "insert";
    const budgetParams = extractIds("budgetId", body, operation);
    const data = await putBudget(budgetParams as BudgetParamGroup, body);
    res.status(200).json(data);
  } catch (err) {
    if (typeof err === 'string' && err.startsWith("Invalid body parameters")) {
      return res.status(400).json({ msg: err });
    }
    return res.status(500).json({ msg: err });
  }
}

export async function handleGet(req: any, res: any) {
  try {
    const budgetParams = extractIds("budgetId", req.params, "query");
    const data = await getBudgets(budgetParams as BudgetParamGroup);
    res.status(200).json(data);
  } catch (err) {
    if (typeof err === 'string' && err.startsWith("Invalid body parameters")) {
      return res.status(400).json({ msg: err });
    }
    return res.status(500).json({ msg: err });
  }
}