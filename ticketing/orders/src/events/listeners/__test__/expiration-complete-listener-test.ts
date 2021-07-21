import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import {ExpirationCompleteListener} from '../expiration-complete-listener';
import { Order } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { ExpirationCompleteEvent, OrderStatus} from "@itay_tix/common/build/index";
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  
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

it('updates the order status to cancelled', async () => {
  const {data, msg, order, ticket, listener} = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  
  expect(updatedOrder!.version).toEqual(OrderStatus.Cancelled);

  // expect(updatedOrder?.version).toEqual(order.version + 1);
});

it('Emitts order cancelled event', async () =>{
  const {data, msg, order, ticket, listener} = await setup();
  
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () =>{
  const {data, msg, order, ticket, listener} = await setup();
  
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled();
})