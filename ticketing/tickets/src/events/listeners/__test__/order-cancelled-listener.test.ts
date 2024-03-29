import { OrderCancelledEvent } from "@itay_tix/common/build/index";
import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/ticket";
import mongoose from 'mongoose';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const userId = mongoose.Types.ObjectId().toHexString();
  const orderId = mongoose.Types.ObjectId().toHexString();
  
  const ticket = Ticket.build({
    userId: userId,
    title: 'test',
    price: 11
  });

  ticket.set({orderId});

  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return {msg, data, ticket, orderId, listener, userId};
}

it('updates the ticket, publishes an event and acks the message', async () =>{
  const  {msg, data, ticket, orderId, listener, userId} = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();

})