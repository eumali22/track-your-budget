import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { getTransactions } from './models/TransactionModel.js';

const app = express();

app.use(cors());

// Configure body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/transactions', (req, res) => { // query all
    getTransactions().then((data) => res.json(data.Items));
});

app.listen(process.env.PORT, () => {
    console.log("listening on port %d", process.env.PORT)
});