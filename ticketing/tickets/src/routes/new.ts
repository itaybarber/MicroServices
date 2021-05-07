// This file is responsible to create a new ticket
import express, {Request, Response} from 'express';
import {body} from 'express-validator'; // To validate properties on the requests body. Would be wired up as a middelware. 
import {requireAuth, validateRequest} from '@itay_tix/common/build/index';
import {Ticket} from '../models/ticket';

const router = express.Router();
router.post(
    '/api/tickets',
    requireAuth, [
      body('title').not().isEmpty().withMessage('Title is requiered'), // Doing this validation check here doesn't cause errors to be thrown or to a res to be sent back etc. 
      // But it will set an error on the incoming request. So we should inspect that req and responde to it if requiered
      body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0'), 
    ], 
  validateRequest ,
  async (req:Request, res: Response) => {
    const {title, price} = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id
    });

    await ticket.save();

    res.status(201).send(ticket);
});

export {router as createTicketRouter} ;