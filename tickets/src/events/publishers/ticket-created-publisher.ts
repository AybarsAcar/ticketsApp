import { Publisher, Subjects, TicketCreatedEvent } from '@aybars-proj/common';

/* 
to publish an event when a ticket is created
*/
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
