import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@aybars-proj/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    // find the order from the PaymentCreated data
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // update the status and sace
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
