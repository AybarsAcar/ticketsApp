import { Publisher, Subjects, TicketUpdatedEvent } from '@aybars-proj/common';

/* 
to publish an event when a ticket is updated
*/
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
