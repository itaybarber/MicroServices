import {Publisher, Subjects, TicketCreatedEvent} from '@itay_tix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

