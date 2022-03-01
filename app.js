import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {router as transactionsRoute} from './routes/transactions.js';

const app = express();

app.use(cors());

// Configure body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Register routes
app.use('/transactions', transactionsRoute);

app.listen(process.env.PORT, () => {
    console.log("listening on port %d", process.env.PORT);
});