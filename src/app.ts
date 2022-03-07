import express from 'express';
import bodyParser from 'body-parser';
import cors, { CorsRequest } from 'cors';
import transactions from './routes/transactions';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';


export default function createApp (db: DynamoDBDocumentClient): express.Express {
    const app = express();

    app.use(cors());

    // Configure body parser middleware
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Register routes
    app.use('/transactions', transactions(db));

    app.set('query parser', 'simple');

    return app;
}
