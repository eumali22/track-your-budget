import { getTransactions } from '../models/transactionModel';
import express, { Router } from 'express';

export const router: Router = express.Router();

router.get('/:id?', async (req, res) => {
    let transId = null;
    if (req.params.id) {
        transId = req.params.id;
    } else if (req.query.id) {
        transId = req.query.id;
    }
    const data = await getTransactions(transId);
    return res.json(data.Items);
});
