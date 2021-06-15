import { Subjects, Publisher, OrderCreatedEvent } from "@itay_tix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}