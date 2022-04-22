import { getTransactions, putTransaction } from '../models/transactionModel';
import express from 'express';
import { createAttrs, Attributes } from '../models/common';
import { TransactParamGroup } from '../types/types';
import short from 'short-uuid';
import { constants } from '../lib/common';

// TO DO hardcoded for now
const USER_ID = "1";
const BUDGET_ID = "1";
const ACCT_ID = "1";

export const router = express.Router();

export default function () {
    router.get('/:id?', async (req, res) => {
        let transId = null;
        if (req.params.id) {
            transId = req.params.id;
        } else if (req.query && req.query.id) {
            if (typeof req.query.id === 'string') {
                transId = req.query.id;
            } else {
                console.log("req.query.id is another type: " + typeof req.query.id);
            }
        }

        const data = await getTransactions({
            userId: USER_ID,
            budgetId: BUDGET_ID,
            accountId: ACCT_ID,
            transactionId: transId
        });

        if (typeof data === 'string') {
            res.json({msg: data, Count: 0});
        } else { // array of item objects
            res.json(data);
        }
    });

    router.post('/', async (req, res) => {
        try {
            const transactionParams = Object.fromEntries(
                Object.entries(constants.transactionIdKeys).map(([key, val]) => {
                    return [key, getIdFromBody(key, req.body[key], true)];
                }));

            const data = await putTransaction(transactionParams as TransactParamGroup, createAttrs(req.body, Attributes.transactionAttrs));
            res.status(200).json(data);

        } catch (err) {
            res.status(500).json({ msg: "Error encountered: " + err, Count: 0 });
        }
    });

    return router;
}

function getIdFromBody(propName: string, prop: string, isRequired: boolean): string {
    if (!prop) {
        if (propName === "transactionId") {
            return short.generate(); // random uuid for new records
        }
        if (isRequired) {
            throw `No ${propName} in request body!`;
        }
    }
    return prop;
}



