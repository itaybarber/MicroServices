import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import {Order} from '../../models/order';
import {Ticket} from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Concerte',
    price: 20
  });

  await ticket.save();

  return ticket;
}

it('fetches orders for a paricular user', async () => {
  // Create 3 tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket(); 

  const user1 = global.signin();
  const user2 = global.signin();
  
  // Create 1 order as User 1#
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ticketId: ticket1.id})
    .expect(201);

  // Create 2 order as User 2#
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ticketId: ticket2.id})
    .expect(201);
    
  const {body: orderTwo} = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ticketId: ticket3.id})
    .expect(201);
    
    // Make req to get orders for User 2#
  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  // Make sure we got only the orders for User 2#
  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(orderOne.id);
  expect(res.body[1].id).toEqual(orderTwo.id);
  expect(res.body[0].ticket.id).toEqual(ticket2.id);
  expect(res.body[1].ticket.id).toEqual(ticket3.id);

});

