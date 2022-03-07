import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import transactions from './routes/transactions';
import { ddbDocClient as db } from './libs/ddbDocClient';

const app = express();

app.use(cors());

// Configure body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Register routes
app.use('/transactions', transactions(db));

app.set('query parser', 'simple');

app.listen(process.env.PORT, () => {
    console.log("listening on port %d", process.env.PORT);
});