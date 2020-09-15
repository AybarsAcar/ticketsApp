import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

//
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  /*
  the reason you want to specify the type is that
  ts is afraid me might change it in the future, or add readonly
  readonly is same as final in Java
  */
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  /* 
  enforce type checking for our data for tickets
  to avoid passing the wrong data for the class
  */
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data:', data);
    // and acknowledge
    msg.ack();
  }
}
