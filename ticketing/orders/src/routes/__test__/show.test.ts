import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({ 
    title: 'test',
    price: 20
  });
  await ticket.save();

  const user = global.signin();
  // Make req to build an order for that ticket
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201);

  // Make req to fetch the order
  const {body: fetchedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);    
  
  expect(fetchedOrder.id).toEqual(order.id);
});

it('Returns an error if one user tries to fetch another users order', async () => {
  // Create a ticket
  const ticket = Ticket.build({ 
    title: 'test',
    price: 20
  });
  await ticket.save();

  const user = global.signin();
  const user2 = global.signin();
  // Make req to build an order for that ticket
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ticketId: ticket.id})
    .expect(201);

  // Make req to fetch the order
  const {body: fetchedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user2)
    .send()
    .expect(401);      
});