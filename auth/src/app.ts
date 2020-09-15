import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';

// import erorrHangled
import { errorHandler, NotFoundError } from '@aybars-proj/common';

// import routes
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

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
console.log(process.env.NODE_ENV);

// routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*', () => {
  throw new NotFoundError();
});

// error handler
app.use(errorHandler);

export { app };
