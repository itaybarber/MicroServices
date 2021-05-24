import nats, {Message} from 'node-nats-streaming';
import { randomBytes} from 'crypto';

console.clear();

                                       // The random bytes: for having a random client name
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('listener connected to NATS');

  const options = stan.subscriptionOptions()
    .setManualAckMode(true);

  const subscription = stan.subscribe(
    // name of channel:
    'ticket:created', 
    // Queue groud name: (in case we have several instances of the listener and we don't want it to repeat the same)
    'orders-service-queue-group',
    options);

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${(data)}`);
    }

    msg.ack();
  });
});