import cors from 'cors';
import express from 'express';

import routes from './Routes';
import server from './server';

const app:express.Express = express();

app.use(cors());
app.use(routes);

const PORT:number = 8080;

server(PORT, app);