import { Listener, NotFoundError, OrderCreatedEvent, OrderStatus, Subjects } from "@itay_tix/common/build/index";
import { Message } from "node-nats-streaming";
import { queueGroupName} from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket, that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket is found, throw an error
    if (!ticket) {
      throw new NotFoundError();
    }

    // Mark ticket as being reserved by setting it's orderId prop
    ticket.set({orderId: data.id});

    // Save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: data.id
    });
    // ack the message
    msg.ack();
  }
}