import nats from 'node-nats-streaming';

// stan is basically the client
const stan = nats.connect('ticketing','abc', {
    url: 'http://localhost:4222',
});

// After successufly connection, stan is going to emit a "connected" event and we're gonna listen to it
stan.on('connect', () => {
  console.log('publisher connected to nats');
    
  const dataToShare = JSON.stringify( {
    id: '123',
    title: 'Concert',
    price: 20
});
  stan.publish('ticket:created', dataToShare, () => {
    console.log('Event published');
  });

});

 

