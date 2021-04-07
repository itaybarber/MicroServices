import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler} from './middelwares/error-handler';
import { NotFoundError} from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);  // Traffic is being proxied to our app through Ingress Nginx. 
                               // Express is gonna see that stuff is being proxide and by defualit
                               // express is gonna is not going to trust that https connection 
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true // Require to use an HTTPS connection
}));

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

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true});

      console.log('Connected to MongoDB');
    } catch (err) {
    console.log(err);
    }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!! ' + new Date(Date.now()).toTimeString());
  });
    
}


start();
