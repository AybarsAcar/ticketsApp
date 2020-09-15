import { Publisher, Subjects, OrderCancelledEvent } from '@aybars-proj/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
