import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export const signin = () => {

  // Build a JWT payload. The payload is going to have: {id, email}
  const payload = {
      id: new mongoose.Types.ObjectId().toHexString(), //fake id
      email: 'test@test.org' // fake mail
  }
  // Create the JWT. Via running the JWT signin func in the auth middelware
  // When we create a JWT, we must include or make use of JWT_KEY, which is defined in the before all statement
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build the session object -> take the converted base64 and make a key of jwt and value of the generated string
  const session = {jwt: token};

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  
  // return a string: that's the cookie with the encoded data
  return [`express:sess=${base64}`]; // Supertest likes to receive an array as the cookie
};