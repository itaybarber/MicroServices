// This file is responsible to create a new ticket
import express, {Request, Response} from 'express';

const router = express.Router();
router.post('/api/tickets', (req:Request, res: Response) => {
  res.sendStatus(200);
});

export {router as createTicketRouter} ;