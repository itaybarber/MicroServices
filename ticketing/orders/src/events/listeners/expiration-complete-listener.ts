import { Listener,  ExpirationCompleteEvent, Subjects, NotFoundError, OrderStatus} from "@itay_tix/common/build/index";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket'); // The populate is to check whether we have a ticket

    if (!order) {
      return new NotFoundError();
    }

    if (order.status == OrderStatus.Created || order.status == OrderStatus.AWaitingPayment) {
      order.set({
        status: OrderStatus.Cancelled,
        }); 

      await order.save();

      await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id
        }
      });
      
      msg.ack();
    }
  }
}