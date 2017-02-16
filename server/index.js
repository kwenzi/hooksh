import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import router from './router';
import notFound from './notFound';

const app = express();

// Basic server setup: log, parse request body, metho
const loggerFormat = process.env.NODE_ENV == 'production' ?
'combined': 'dev';

app.use(logger(loggerFormat));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Let router handle everything. Everything else is not found.
app.use('/', router);
app.use(notFound);

const port = process.env.PORT || 3000;
const server = app.listen(
  port,
  () => {
    console.log('server started');
});
