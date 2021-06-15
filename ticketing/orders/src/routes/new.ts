import mongoose from 'mongoose';
import express, {Request, Response} from 'express';
import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from '@itay_tix/common/build/index';
import {body} from 'express-validator';
import {Ticket} from '../models/ticket';
import {Order} from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

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
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  // Build the order and save it to DB
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt : expirationDate,
    ticket : ticket
  });

  await order.save();

  // Publish an event saying order was created
  new OrderCreatedPublisher(natsWrapper.client).publish({id: order.id, status: order.status, userId: order.userId, expiresAt: order.expiresAt.toISOString(), ticket: {id: ticket.id, price: ticket.price} });

  res.status(201).send(order);
});

export {router as newOrderRouter};
