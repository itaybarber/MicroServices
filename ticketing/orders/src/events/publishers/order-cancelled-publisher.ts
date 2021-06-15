import { Subjects, Publisher, OrderCancelledEvent } from '@itay_tix/common/build/index';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}