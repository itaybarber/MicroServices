import request from 'supertest';
import {app} from '../../app';

it('fails when an email that doensn\'t exist is supplied', async () =>{
    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(400);
})

it('it fails when an incorrect pass is supplied', async() => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);

    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password : 'gibrish'
    })
    .expect(400);
})

it('response with a cookie when given valid credentials', async() =>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);

    const response = await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password : 'password'
    })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
})