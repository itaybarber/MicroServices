import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@itay_tix/common/build/index";
import { Message } from "node-nats-streaming";
import { queueGroupName} from './queue-group-name';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message): void {
    throw new Error("Method not implemented.");
    }
}