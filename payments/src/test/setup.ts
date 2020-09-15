// TEST SUITE CONFIGURATION

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';

import request from 'supertest';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

// make use of our mock files
jest.mock('../nats-wrapper');

let mongo: any;
// start an instance of mongodb memory
beforeAll(async () => {
  // set the env variables for the test suite
  process.env.JWT_KEY = 'abcd';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  // start up mongodb memory server
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  // connect mongoose to inmemory server
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// runs before each of our tests
beforeEach(async () => {
  /*
  have a fresh mock implementation
  to avoid other test suits affacting each other when mock functions are called
  */
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// runs after all of our tests
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// write a global function
global.signin = (id?: string) => {
  // build jwt payload. {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object {jwt: JWT}
  const session = { jwt: token };

  // turn the session into JSON
  const sessionJSON = JSON.stringify(session);

  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string
  return [`express:sess=${base64}`];
};
