import mongoose from 'mongoose';
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@itay_tix/common/build/index";
import {OrderCreatedListener} from '../order-created-listener';
import { Message } from 'node-nats-streaming';


const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  const userId = mongoose.Types.ObjectId().toHexString();
  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'test',
    price: 20,
    userId: userId
  });

  await ticket.save();

  // Create a fake data event - a data property to satisfy the orderCreatedEvent interface
  const data : OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: userId,
    expiresAt: 'askjdhaskjhd',
    ticket: {
        id: ticket.id,
        price: ticket.price,
    }
  };

  // @ts-ignore
  const msg : Message = {
    ack: jest.fn()
  };

  return {listener, ticket, data, msg};
}

it('Sets the orderId of the ticket', async () => {
  const {listener, ticket, data, msg} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket?.orderId).toEqual(data.id);

});

it('Acks the msg', async () => {
  
  const {listener, ticket, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
})

it('Publishes ticket have been updated', async () => {
  const {listener, ticket, data, msg} = await setup();

  await listener.onMessage(data,msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});