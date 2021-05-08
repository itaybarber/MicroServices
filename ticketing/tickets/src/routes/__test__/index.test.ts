import request from 'supertest';
import {app} from '../../app';

const createTicket = () =>{
  return request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'test',
    price: 213
  });
}

it('can fectch a list of tickets', async () => {
  await createTicket(); // Because we get a promise from this, we do want to await it
  await createTicket();
  await createTicket();

  const res = await request(app)
  .get('/api/tickets')
  .send()
  .expect(200);

  expect(res.body.length).toEqual(3);
})