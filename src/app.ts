import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import transactions from './routes/transactions';
import budgets from './routes/budgets';

export default function (): express.Express {
    const app = express();

    app.use(cors());

    // Configure body parser middleware
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Register routes
    app.use('/transactions', transactions());
    app.use('/budgets', budgets());

    app.set('query parser', 'simple');

    return app;
}