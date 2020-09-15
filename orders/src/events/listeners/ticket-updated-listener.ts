import { Listener, Subjects, TicketUpdatedEvent } from '@aybars-proj/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

/* 
the listener that listens for the events from the Tickets Service
for tickets updates
 */
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

  /* 
  to make sure if we have more than 1 Orders Service,
  it wont be sent to both
  */
  queueGroupName = queueGroupName;

  /* 
  called when an event is received
  this is to update our own database
  */
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // find the ticket by id and version then update its data
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket version not found');
    }

    const { title, price } = data;

    // update the ticket and increment the version
    ticket.set({ title, price });
    await ticket.save();

    // acknowledge the message
    msg.ack();
  }
}
