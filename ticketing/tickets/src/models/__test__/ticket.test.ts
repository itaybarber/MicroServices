import {Ticket} from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'asd',
    price: 5,
    userId: '123'
  });

  // Save a ticket to DB
  await ticket.save();

  // fetch the same ticket twice
  const fetchedTicket1 = await Ticket.findById(ticket.id);
  const fetchedTicket2 = await Ticket.findById(ticket.id);

  // make 2 seperate changes to the fetched tickets
  fetchedTicket1!.set({price: 10});
  fetchedTicket2!.set({price: 50});

  // save the 1st fetched ticket. Should work as expected
  await fetchedTicket1!.save();

  // save the 2st fetched ticket, with the out-dated version number.. Should have an error
  try {
    await fetchedTicket2!.save();
  }
  catch (err) {
    return done();
  }

  throw new Error('Should not reach here');
})