import { getTransactions, putTransaction } from '../models/transactionModel';
import express from 'express';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { idPrefixes, transactionAttrs } from '../libs/common';
import { TransactParamGroup } from '../types/types';
import short from 'short-uuid';

// TO DO hardcoded for now
const USER_ID = "1";
const BUDGET_ID = "1";
const ACCT_ID = "1";

export const router = express.Router();

export default function (db: DynamoDBDocumentClient) {
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

        const data = await getTransactions(db, {
            userId: USER_ID,
            budgetId: BUDGET_ID,
            accountId: ACCT_ID,
            transactionId: transId
        });

        if (typeof data === 'string') {
            return res.json({msg: data, Count: 0});
        } else { // array of item objects
            res.json(data);
        }
    });

    router.post('/', async (req, res) => {
        try {
            const transactionParams = Object.fromEntries(
                Object.entries(idPrefixes).map(([key, val]) => {
                    return [key, getIdFromBody(key, req.body[key], true)];
                }));

            const attributes = {
                is_start_bal: req.body.is_start_bal
            };

            const data = await putTransaction(db, transactionParams as TransactParamGroup, {
                is_start_bal: getAttrFromBody<boolean>("is_start_bal", req.body.is_start_bal, true), 
                is_outflow: getAttrFromBody<boolean>("is_outflow", req.body.is_outflow, true), 
                category: getAttrFromBody<string>("category", req.body.category, false),
                trans_date: getAttrFromBody<string>("trans_date", req.body.trans_date, true),
                memo: getAttrFromBody<string>("memo", req.body.memo, false),
                value: getAttrFromBody<number>("value", req.body.value, true),
            });
            res.status(200).json(data);

        } catch (err) {
            return res.status(500).json({ msg: "Error encountered: " + err, Count: 0 });
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

function getAttrFromBody<T>(attrName: string, attr: T, isRequired: boolean): T {
    if (attr === undefined || attr === null) {
        if (isRequired) {
            throw `No ${attrName} in request body!`;
        }
    }
    return attr;
}


