import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {signin} from '../../test/signin';
import {Order} from '../../models/order';
import { OrderStatus } from '@itay_tix/common/build/index';


it('returns a 404 when an error does not exists', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: '1234',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it('returns a 401 when purchesing an order that does not belong to user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  }
  );

  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie', signin())
  .send({
    token: '1234',
    orderId: order.id
  })
  .expect(401);
}) 

it('returns a 400 when purchesing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  }
  );

  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie', signin(userId))
  .send({
    token: '1234',
    orderId: order.id
  })
  .expect(400);
});
 