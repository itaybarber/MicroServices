import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  title: string,
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string,
  price: number

  isReserved(): Promise<boolean>; // The Promise resolves with a bool
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs) : TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },

  price: {
    type: Number,
    require: true,
    min: 0
  },
},
{
  toJSON: {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
}
});


// The statics object is how we add new method directly to the ticket model
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
}

ticketSchema.methods.isReserved = async function () {
  // this === the ticketDoc that we just called 'isReserved' on
  // That's why we need to use the keyword function, not to mess up with "this"

  // Run query to look at all orderes and to find an order where the ticket
  // is the ticket we found above & the order stat is not cancelled
const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AWaitingPayment,
        OrderStatus.Complete,
        
      ]
    }
  });

  return !!existingOrder; // If it will be null, it will flip it to true, then to false;
}

// The ticket model is the object that get us access to the overall collection
const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket', ticketSchema);

export {Ticket}; 