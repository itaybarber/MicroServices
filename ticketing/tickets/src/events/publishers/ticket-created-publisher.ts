import {Publisher, Subjects, TicketCreatedEvent} from '@itay_tix/common/build/index';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

