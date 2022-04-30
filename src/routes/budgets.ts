import express from "express";
import { getBudgets, putBudget } from "../models/budgetModel";
import authorizeAccessToken, { getCurrentUserId } from "../services/auth";
import { handleGet, handlePost } from "./common";

export const router = express.Router();

export default function () {
  router.get('/:budgetId?',
    async (req, res) => handleGet(getCurrentUserId(), "budgetId", req.params, res, getBudgets)
  );

  router.post('/',
    authorizeAccessToken,
    async (req, res) => handlePost(getCurrentUserId(), "budgetId", req.body, res, putBudget)
  );

  return router;
}
