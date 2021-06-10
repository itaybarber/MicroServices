import mongoose from 'mongoose';
import express, {Request, Response} from 'express';
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from '@itay_tix/common/build/index';
import {body} from 'express-validator';
import {Ticket} from '../models/ticket';
import {Order} from '../models/order';

const router = express.Router();

router.post(
  '/api/orders', 
  requireAuth, 
  [
    body('ticketId').not().isEmpty().custom((input: string) => mongoose.isValidObjectId(input)).withMessage("Ticket id must be provided")
  ],
  validateRequest
  ,
async (req:Request, res: Response) => {
  const {ticketId} = req.body;
  // Find the ticket the user is trying to order in DB
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  // Make sure ticket is not reserved already
    const isReserved = await ticket.isReserved();
  
  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved');
  }
  
  // Calc an expiration date for order
  
  // Build the order and save it to DB

  // Pulish an event saying order was created

  res.send({});
});

export {router as newOrderRouter};
