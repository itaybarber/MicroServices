 import request from 'supertest';
 import {app} from '../../app';

it('response with details about the current user', async () => {
  

  const cookie = await global.signin('test@test.com', 'password');

  const response = await request(app)
  .get('/api/users/currentuser')
  .set('Cookie', cookie) // Important --> setting the cookie up
  .send()
  .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
})

it('response with null if not authenticated', async () => {
  const response = await request(app)
  .get('/api/users/currentuser')
  .send()
  .expect(200);

  expect(response.body.currentUser).toEqual(null);
})