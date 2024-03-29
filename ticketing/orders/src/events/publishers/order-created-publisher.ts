import { Subjects, Publisher, OrderCreatedEvent } from "@itay_tix/common/build/index";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}