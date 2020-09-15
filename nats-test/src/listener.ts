// listens for events
import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const randId = randomBytes(4).toString('hex');

// create a client that connects to nats streaming server
// stan is the name for the client -- community convension
const stan = nats.connect('ticketing', randId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// these commands are for unix
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
