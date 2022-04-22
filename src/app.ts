import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import transactions from './routes/transactions';
import budgets from './routes/budgets';
import accounts from './routes/accounts';
import checkToken from './routes/tokens';
import auth from './routes/auth';

export default function (): express.Express {
    const app = express();

    app.use(cors());

    // Configure body parser middleware
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Register routes
    app.use('/transactions', transactions());
    app.use('/budgets', budgets());
    app.use('/accounts', accounts());
    app.use('/checktoken', checkToken());
    app.use('/auth', auth());

    app.set('query parser', 'simple');

    return app;
}