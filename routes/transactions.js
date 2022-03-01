import { getTransactions } from '../models/transactionModel.js';
import express from 'express';

// Define a new Router object
export const router = new express.Router();

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
