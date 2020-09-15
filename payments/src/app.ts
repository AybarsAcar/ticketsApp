import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';

// import erorrHangled
import { errorHandler, NotFoundError, currentUser } from '@aybars-proj/common';

// import routes
import { createChargeRouter } from './routes/new';

// init express
const app = express();
app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

// routes
app.use(createChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// error handler
app.use(errorHandler);

export { app };
