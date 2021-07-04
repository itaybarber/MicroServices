import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@itay_tix/common/build/index';
import { TicketUpdateListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from '../../../models/ticket';
import { Message } from 'node-nats-streaming';
import { setGracefulCleanup } from 'tmp';


const setup = async () => {
  // Create a listener
  const listener = new TicketUpdateListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'test',
      price: 30
    });

  await ticket.save();
  
  // Create a fake data object
    const data: TicketUpdatedEvent['data'] = {
      id: ticket.id,
      version: ticket.version + 1,
      title: 'passed?',
      price: 21,
      userId: mongoose.Types.ObjectId().toHexString()
    };

  // Create a fake message object
  // @ts-ignore 
  const msg: Message = {
     ack: jest.fn()
   };

  // return all of this stuff
   return {msg, data, ticket, listener};
}

it('finds, updates and saves a ticket', async () => {
  const {msg, data, ticket, listener} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});


it('acks the message', async () => {
  const {msg, data, ticket, listener} = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
  
});

