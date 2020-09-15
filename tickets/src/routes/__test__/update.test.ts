import request from 'supertest';
import { app } from '../../app';
import mongoose, { mongo } from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if ticket is not found', async () => {
  // generate an id
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'testtitle',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'testtitle',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'testtitle',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'testtitle2', price: 10 })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'testtitle',
      price: 20,
    });
  // update it
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 10 })
    .expect(400);
  // update it
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ price: 10 })
    .expect(400);
  // update it
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'updatedtitle', price: -10 })
    .expect(400);
  // update it
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'updatedtitle' })
    .expect(400);
});

it('updates the ticket with valid inputs', async () => {
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'testtitle',
      price: 20,
    });
  // update it
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'updatedtitle', price: 10 })
    .expect(200);

  // fetch it again
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('updatedtitle');
  expect(ticketResponse.body.price).toEqual(10);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'testtitle',
      price: 20,
    });
  // update it
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'updatedtitle', price: 10 })
    .expect(200);

  // make sure the publish is invoked
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updated if the ticket is reserved', async () => {
  const cookie = global.signin();

  // create a ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'testtitle',
      price: 20,
    });

  // set and orderId
  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  // update it
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'updatedtitle', price: 10 })
    .expect(400);
});
