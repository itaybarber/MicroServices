import express, {Request, Response} from 'express';
import {NotAuthorizedError, NotFoundError, requireAuth} from '@itay_tix/common/build/index';
import {Order} from '../models/order';


const router = express.Router();

router.get(
  '/api/orders/:orderId', 
  requireAuth,
  async (req:Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket'); //The populate is to find the order and simultaniously to find the ticket
  
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(order);
});

export {router as showOrderRouter};
