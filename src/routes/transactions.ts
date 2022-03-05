import { getTransactions } from '../models/transactionModel';
import express, { Router } from 'express';

export const router = express.Router();

router.get('/:id?', async (req, res) => {
    let transId = null;
    if (req.params.id) {
        transId = req.params.id;
    } else if (req.query) {
        if (typeof req.query == "string") {
            const query = new URLSearchParams(req.query);
            if (query.has('id')) {
                transId = query.get('name');
            }
        }
    }
    const data = await getTransactions(transId);
    return typeof data === 'string' ? res.json(data) : res.json(data.Items);
});

router.post('/', async (req, res) => {
    /*
    const params = {
        TableName: 'TrackYourBudget',
        Item: {
            // Use Date.now().toString() just to generate a unique value
            id: Date.now().toString(),
            // `info` is used to save the actual data
            info: req.body
        }
    };

    docClient.put(params, (error) => {
        if (!error) {
            // Send a status of 201, which means an item was created
            res.status(201).send();
        } else {
            // If there was an error, send a 500 (Internal Server Error) along with the error
            res.status(500).send('Unable to save record, err' + error);
        }
    });
    */
});
