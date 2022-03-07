import { ddbDocClient as db } from './libs/ddbDocClient';
import app from './app';

const expressApp = app(db);

expressApp.listen(process.env.PORT, () => {
    console.log("listening on port %d", process.env.PORT);
});