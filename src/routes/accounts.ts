import express from 'express';
import { handleGet, handlePost } from './common';
import { getCurrentUserId } from '../services/auth';
import { getAccountsOnly, getAccountsSet, putAccount } from '../models/accountModel';

export const router = express.Router();

export default function () {
  router.get('/first/:budgetId/:accountId?',
    async (req, res) => handleGet(getCurrentUserId(req), "accountId", req.params, res, getAccountsOnly)
  );
  router.get('/all/:budgetId/:accountId?',
    async (req, res) => handleGet(getCurrentUserId(req), "accountId", req.params, res, getAccountsSet)
  );
  router.post('/',
    // authorizeAccessToken,
    async (req, res) => handlePost(getCurrentUserId(req), "accountId", req.body, res, putAccount)
  );

  return router;
}
