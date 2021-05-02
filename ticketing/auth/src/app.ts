import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { NotFoundError, errorHandler} from '@itay_tix/common/build/index';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
app.set('trust proxy', true);  // Traffic is being proxied to our app through Ingress Nginx. 
                               // Express is gonna see that stuff is being proxide and by defualit
                               // express is gonna is not going to trust that https connection 
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' // Require to use an HTTPS connection in case we're not in test environment
})
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// When we throw the error, express is going to catch the error,
// and sent it of to our middleware. 
// That middleware is going to take this status code and it's going to call the 
// Serialize Errors fucntion and going to generate a response and that
// response is going to be sent to anyone trying to access this route
app.all('*', async (req, res) => { 
  throw new NotFoundError()
});

app.use(errorHandler);

export {app};