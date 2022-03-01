import { getTransactions } from '../models/transactionModel.js';
import express from 'express';

// Define a new Router object
export const router = new express.Router();

router.get('/:id?', async (req, res) => {
    if (req.params.id) {
        const data = await getTransactions(req.params.id);
        return res.json(data.Items);
    } else {
        const data_1 = await getTransactions();
        return res.json(data_1.Items);
    }
    
});
