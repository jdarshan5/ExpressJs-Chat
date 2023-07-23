import './environment/index.js';
import conn from './db/conn.js';

import express from 'express';

import router from './router/index.js';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use('/index.html', router.MainRouter);
app.use('/todo', router.TodoRouter);

app.listen(PORT, (error) => {
    if(!error) {
        console.log(`Server is Successfully Running, and App is listening on port ${PORT}`);
    } else {
        console.error(`Error occured, Server can't start ${error}`);
        process.exit();
    }
});
