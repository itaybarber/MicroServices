import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {validateRequest} from '../middelwares/validate-request';


const router = express.Router();

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be applied')
],
validateRequest,
(req: Request, res: Response) => {
});

export {router as signinRouter};