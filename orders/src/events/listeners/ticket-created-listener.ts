import { Listener, TicketCreatedEvent, Subjects } from '@aybars-proj/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

/* 
the listener that listens for the events from the Tickets Service
for ticket created
 */
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

  /* 
  to make sure if we have more than 1 Orders Service,
  it wont be sent to both
  */
  queueGroupName = queueGroupName;

  /* 
  called when an event is received
  this is to save to our own database
  */
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    // acknowledge the message
    msg.ack();
  }
}
