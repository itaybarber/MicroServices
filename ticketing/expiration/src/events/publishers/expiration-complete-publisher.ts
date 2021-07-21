import { Publisher, Subjects, ExpirationCompleteEvent } from "@itay_tix/common/build/index";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    
}