import express, { Request, Response} from 'express';
import {body} from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@itay_tix/common/build/index';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher} from '../events/publishers/ticket-updated-publisher';
import {natsWrapper} from '../nats-wrapper';


const router = express.Router();
router.put(
  '/api/tickets/:id', 
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is requiered'),
        body('price')
	.isFloat({gt: 0 })
	.withMessage('Price must be greater than 0'),
  ], 
  validateRequest, 
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    }); // Updates the document in memory, not the mongoDB data base

    await ticket.save(); // After save, those updates will be persisted to the DB
    // and mongoose will make sure that any further updates either due to some post save hooks, or
    // pre-save hooks or something that is done by mongoDB iteself or anything else, will be persisted
    // back to this ticket document, so we don't need to re-fetch that ticket doc

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
     }); 
    res.send(ticket);
  }
);

export {router as updateTicketRouter};