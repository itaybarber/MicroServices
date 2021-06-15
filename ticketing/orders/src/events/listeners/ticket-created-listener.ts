import {Message} from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent} from '@itay_tix/common/build/index';
import {Ticket} from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;
 
            // The data from the event
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const {id, title, price} = data;
    const ticket = Ticket.build({id, title,price});
    await ticket.save();
  
    msg.ack();
  }
}