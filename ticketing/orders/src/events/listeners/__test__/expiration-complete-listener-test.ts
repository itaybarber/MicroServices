import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import {ExpirationCompleteListener} from '../expiration-complete-listener';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { ExpirationCompleteEvent, OrderStatus} from "@itay_tix/common/build/index";
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client).listen();
  
  const ticketId = mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    id: ticketId,
    title: 'testy',
    price: 200
  });

  const orderId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'sakldja',
    expiresAt: new Date(),
    ticket: ticket
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: orderId
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };


  return {data, msg, order, ticket, listener};
}

it('')