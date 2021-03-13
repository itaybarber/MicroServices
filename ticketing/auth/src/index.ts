import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler} from './middelwares/error-handler';
import { NotFoundError} from './errors/not-found-error';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// When we throw the error, express is going to catch the error,
// and sent it of to our middleware. 
// That middleware is going to take this status code and it's going to call the 
// Serialize Errors fucntion and going to generate a response and that
// response is going to be sent to anyone trying to access this route
app.all('*', async (req, res, next) => { throw new NotFoundError()});

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!!!! ' + new Date(Date.now()).toTimeString());
});
