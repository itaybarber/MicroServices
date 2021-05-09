import nats from 'node-nats-streaming';

// stan is basically the client
const stan = nats.connect('ticketing','abc', {
    url: 'http://localhost:4222',
});

// After successufly connection, stan is going to emit a "connected" event and we're gonna listen to it
stan.on('connect', () => {
    console.log('publisher connected to nats');
});

