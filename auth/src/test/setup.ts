// TEST SUITE CONFIGURATION

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

import request from 'supertest';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

let mongo: any;
// start an instance of mongodb memory
beforeAll(async () => {
  // set the env variables for the test suite
  process.env.JWT_KEY = 'abcd';

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
  //
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
global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  return cookie;
};
