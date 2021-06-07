import {Publisher, Subjects, TicketUpdatedEvent} from '@itay_tix/common/build/index';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

