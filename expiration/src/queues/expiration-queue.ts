import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

// for the info that will stored in the job object
interface Payload {
  orderId: string;
}

// init the queue
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

/*
job is an object that wraps our data
we will send other data with it as well like date, etc as well
*/
expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

// export the queue
export { expirationQueue };
