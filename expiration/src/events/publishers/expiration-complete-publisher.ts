import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@aybars-proj/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
