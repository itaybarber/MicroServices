import { NotFoundError } from '@itay_tix/common/build';
import express, {Request, Response} from 'express';
import {Ticket} from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return new NotFoundError;
  }

  return res.send(ticket); // The defualt is 200
});

export {router as showTicketRouter};