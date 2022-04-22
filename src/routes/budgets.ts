import express from "express";
import { getBudgets, putBudget } from "../models/budgetModel";
import authorizeAccessToken, { getCurrentUserId } from "../services/auth";
import { BudgetParamGroup } from "../types/types";
import { extractIds, handlePost } from "./common";

export const router = express.Router();

export default function () {
  // expected req is defined since we use body-parser middleware
  router.post('/', 
    // authorizeAccessToken,
    async (req, res) => handlePost(getCurrentUserId(), "budgetId", req.body, res, putBudget)
  );

  router.get('/:budgetId?',
    async (req, res) => handleGet(getCurrentUserId(), req.params, res)
  );

  return router;
}

export async function handleGet(uid: string, params: {budgetId?: string}, res: any) {
  try {
    const budgetParams = extractIds("budgetId", { userId: uid, ...params }, "query");
    const data = await getBudgets(budgetParams as BudgetParamGroup);
    res.status(200).json(data);
  } catch (err) {
    if (typeof err === 'string' && err.startsWith("Invalid body parameters")) {
      return res.status(400).json({ msg: err });
    }
    return res.status(500).json({ msg: err });
  }
}
