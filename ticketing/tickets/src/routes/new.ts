// This file is responsible to create a new ticket
import express, {Request, Response} from 'express';
import {requireAuth} from '@itay_tix/common/build/index';

const router = express.Router();
router.post('/api/tickets',requireAuth ,(req:Request, res: Response) => {
  res.sendStatus(200);
});

export {router as createTicketRouter} ;