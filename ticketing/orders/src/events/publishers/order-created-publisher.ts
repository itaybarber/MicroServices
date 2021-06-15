import { Subjects, Publisher, OrderCancelledEvent } from "@itay_tix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

}