import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';


it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'sdfdsfds',
      price: 20
    })
    .expect(404);
});

it('returns a 401 if the user is not auth-ed', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sdfdsfds',
      price: 20
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'sdfdsfds',
      price: 20
    });
    
  await request(app)
  .put(`/api/tickets/${res.body.id}`)
  .set('Cookie', global.signin())
  .send({
    title: 'different',
    price: 20
  })
  .expect(401);

});

it('returns a 400 if the user provides an invalid title or price', async () => {
  
});

it('updates the ticket, provided correct props', async () => {
  
});

