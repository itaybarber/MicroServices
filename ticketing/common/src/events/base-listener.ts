import nats, {Message, Stan} from 'node-nats-streaming';
import {Subjects} from './subjects';

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    private client: Stan;
    protected ackWait= 5 * 1000; // 5 seconds 
    abstract onMessage(data: T['data'], msg: nats.Message): void ;
  
   constructor(client: Stan) {
    this.client = client;
  }
  
  subscriptionOptions() {
    return this.client
    .subscriptionOptions()
    .setDeliverAllAvailable() // The first time our subscription is created, we'll get all messages
    .setManualAckMode(true)
    .setAckWait(this.ackWait)
    .setDurableName(this.queueGroupName);   
    }
  
    listen() {
      const subscription = this.client.subscribe(
        this.subject,     // name of channel: 
        // Queue groud name: (in case we have several instances of the listener and we don't want it to repeat the same)
        // The queue group is also important that we won't lose events from past if listener is down from the setDurableName
        this.queueGroupName,
        this.subscriptionOptions());
  
        subscription.on('message', (msg: Message) => {
          console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
  
          const parsedData = this.parseMessage(msg);
          this.onMessage(parsedData, msg);
        });
    }
  
  
    parseMessage(msg: Message) {
      const data = msg.getData();
  
      return typeof data === 'string'? JSON.parse(data) : JSON.parse(data.toString('utf8'));
    }
  }
  