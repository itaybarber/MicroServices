import mongoose from 'mongoose';
import express, {Request, Response} from 'express';
import {requireAuth, validateRequest} from '@itay_tix/common/build/index';
import {body} from 'express-validator';

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
  res.send({});
});

export {router as newOrderRouter};
