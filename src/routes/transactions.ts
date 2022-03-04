import { getTransactions } from '../models/transactionModel';
import express, { Router } from 'express';

export const router = express.Router();

router.get('/:id?', async (req, res) => {
    let transId;
    if (req.params.id) {
        transId = req.params.id;
    } else if (req.query.id) {
        transId = req.query.id as string;
    } else {
        transId = null;
    }
    const data = await getTransactions(transId);
    return typeof data === 'string' ? res.json(data) : res.json(data.Items);
});
