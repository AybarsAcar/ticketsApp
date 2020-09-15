import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from '@aybars-proj/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

/* 
handles the events when expiration occurs
 */
export class ExpirationCompleteListener extends Listener<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;

  queueGroupName = queueGroupName;

  // the listeners handle order cancellation
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    // find the order by its id
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    // now publish an event that the order is cancelled
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
