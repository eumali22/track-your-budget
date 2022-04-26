import express from 'express';
import { getTransactions, putTransaction } from '../models/transactionModel';
import { handleGet, handlePost } from './common';
import { getCurrentUserId } from '../services/auth';

export const router = express.Router();

export default function () {
  router.get('/:budgetId/:accountId/:transactionId?',
    async (req, res) => handleGet(getCurrentUserId(), "transactionId", req.params, res, getTransactions)
  );
  router.post('/', 
    async (req, res) => handlePost(getCurrentUserId(), "transactionId", req.body, res, putTransaction)
  );

  // router.post('/', async (req, res) => {
  //   try {
  //     const transactionParams = Object.fromEntries(
  //       Object.entries(constants.transactionIdKeys).map(([key, val]) => {
  //         return [key, getIdFromBody(key, req.body[key], true)];
  //       }));

  //     const data = await putTransaction(transactionParams as TransactParamGroup, createAttrs(req.body, Attributes.transactionAttrs));
  //     res.status(200).json(data);

  //   } catch (err) {
  //     res.status(500).json({ msg: "Error encountered: " + err, Count: 0 });
  //   }
  // });

  return router;
}

// function getIdFromBody(propName: string, prop: string, isRequired: boolean): string {
//   if (!prop) {
//     if (propName === "transactionId") {
//       return short.generate(); // random uuid for new records
//     }
//     if (isRequired) {
//       throw `No ${propName} in request body!`;
//     }
//   }
//   return prop;
// }



