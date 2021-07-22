import mongoose from 'mongoose';
import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@itay_tix/common/build/index";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  
  const data : OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'askd',
    ticket: {
        id: mongoose.Types.ObjectId().toHexString(),
        price: 213
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return {listener, data, msg};
}

it('repilcates the order info', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);

})