import  Queue  from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>(  // The payload is to make sure we're sending and receiving to our queue the right info
  'order:expiration',
  {
    redis: {
      host: process.env.REDIS_HOST
  }
});

expirationQueue.process(async (job) => {  // The job param is similar to the msg obj in Nats. it is not the acutal data, rather
  // wraps up our data and has some info about the job as well like id and the data we're sending with the job
  console.log('lets publish expiration event completed for orderId', job.data.orderId);
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  });
})

export { expirationQueue };