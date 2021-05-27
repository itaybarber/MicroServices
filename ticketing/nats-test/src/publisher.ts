import nats from 'node-nats-streaming';
import {TicketCreatedPublisher} from './events/ticket-created-publisher';

console.clear();

// stan is basically the client
const stan = nats.connect('ticketing','abc', {
    url: 'http://localhost:4222',
});

// After successufly connection, stan is going to emit a "connected" event and we're gonna listen to it
stan.on('connect', async () => {
  console.log('publisher connected to nats');
   
  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'Concert',
      price: 20
    });
  }
  catch(err) {
    console.log(err);
  }
//   const dataToShare = JSON.stringify( {

// });

//   stan.publish('ticket:created', dataToShare, () => {
//     console.log('Event published, invoked after data publishing');
//   });

});

 

