import app from './app';

const expressApp = app();

expressApp.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});