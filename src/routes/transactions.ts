import { getTransactions } from '../models/transactionModel';
import express, { Router } from 'express';

export const router = express.Router();

router.get('/:id?', async (req, res) => {
    let transId = null;
    console.log(req.query);
    if (req.params.id) {
        transId = req.params.id;
    } else if (req.query && req.query.id) {
        if (typeof req.query.id === 'string') {
            transId = req.query.id;
        } else {
            console.log("req.query.id is another type: " + typeof req.query.id);
        }
    }
    const data = await getTransactions(transId);
    if (typeof data === 'string') {
        return res.json({msg: data, Count: 0});
    } else { // array of item objects
        res.json(data);
    }
    
});

router.post('/', async (req, res) => {
    
});
