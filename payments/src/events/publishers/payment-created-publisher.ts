import { PaymentCreatedEvent, Publisher, Subjects } from '@aybars-proj/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
