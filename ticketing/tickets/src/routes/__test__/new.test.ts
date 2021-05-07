import request from 'supertest';
import {app} from '../../app';

it('has a route handler listening to /api/tickets from post requests',
  async () => {
    const response = await request(app)
    .post('/api/tickets')
    .send({});

    expect(response.status).not.toEqual(404);
  });

it('can only be accessed if the user is signed in',
  async () => {
    const response = await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);

  }
);

it('Returns a status other than 401 if user is signed in',
  async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

    expect(response.status).not.toEqual(401);

  }
);

it('returns an error if an invalid title is provided',
  async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 100
      });
    expect(response.status).toEqual(400);

    const response2 = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 100
      })
    .expect(400);

    const response3 = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'egfad',
      price: 100
      });
    expect(response3.status).toEqual(200);

  }
);

it('returns an error if an invalid price is provided',
  async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'dasdsad',
      price: '-100'
    })
    .expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'dasdsad',
    })
    .expect(400);
});

it('it creates a ticket with valid inputs',
  async () => {
    
});


  