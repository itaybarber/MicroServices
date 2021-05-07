import mongoose from 'mongoose';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// We need the TicketDoc interface if we would like to add some additional properties in the future
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// The 1st arg is an obj and we're going to list all the different props we want it to have
const ticketSchenma = new mongoose.Schema({
  title: {
    type: String,
    required: true},
  price: {
    type: Number,
    required: true},
  userId: {
    type: String,
    required: true
  }},
   {
    toJSON: {
      transform(doc, ret) { // ret is the object that's going to be the json
        ret.id = ret._id;
        delete ret._id;
      }
    }
  });

  ticketSchenma.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
  };

  const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchenma);

  export {Ticket};