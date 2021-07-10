import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';
import {natsWrapper} from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

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

it('returns a 400 if the user provides an invalid title', async () => {
  const cookie = global.signin(); 
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'sdfdsfds',
      price: 20
    });

    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 520
    })
    .expect(400);
  
});

it('returns a 400 if the user provides an invalid price', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'sdfdsfds',
      price: 20
    });

    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: ''} 
    )
    .expect(400);
  
});

it('updates the ticket, provided correct props', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'sdfdsfds',
      price: 20
    });

    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 250} 
    )
    .expect(200);

    const updatedTicket = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

    expect(updatedTicket.body.title).toEqual('test');
    expect(updatedTicket.body.price).toEqual(250);
  
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'sdfdsfds',
      price: 20
    });

    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 250} 
    )
    .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('Rejects update is ticket is reserved', async () => {
  const cookie = global.signin();
  const builtTicketRes = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 33
    });

    const ticket = await Ticket.findById(builtTicketRes.body.id);
    ticket!.set({orderId: mongoose.Types.ObjectId().toHexString()});
    await ticket!.save(); 

    await request(app)
    .put(`/api/tickets/${builtTicketRes.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 250} 
    )
    .expect(400);
}) 