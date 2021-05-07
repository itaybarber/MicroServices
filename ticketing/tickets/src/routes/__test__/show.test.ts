import { response } from 'express';
import request from 'supertest';
import {app} from '../../app';

it('Return a 404 if a ticket is not found', async () => {
  const response = await request(app)
  .get('/api/tickets/dsfdsfdsfdsfsdfdsfdsfds')
  .send()

  console.log(response.body);
});

it('Return a ticket if a ticket is found', async () => {
  const title = 'test';
  const price = 20;
  
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title, price
  })
  .expect(201);
  
  console.log(response.body.id);
  console.log(response.body.title);

  const ticketResponse = await request(app)
  .get(`/api/tickets/${response.body.id}`)
  .send()
  .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});