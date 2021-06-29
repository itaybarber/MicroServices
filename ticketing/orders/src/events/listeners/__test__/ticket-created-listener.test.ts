import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedListener } from "../ticket-created-listener";
import { TicketCreatedEvent } from "@itay_tix/common/build/index";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event (type of ticketCreateEvent)
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concerte',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  // create a fake Message object (comes from node-nats-streaming) 
  // @ts-ignore
  const message : Message = {
    ack: jest.fn()
  };

  return {listener, data, message};
}

it('creates and saves a ticket', async () => {
  const {listener, data, message} = await setup();

  // call onMessage fuction with the data object + message object
  await listener.onMessage(data, message);

  // write assertions to make sure a tickets was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  
})

it('acks the message', async () => {
   
})