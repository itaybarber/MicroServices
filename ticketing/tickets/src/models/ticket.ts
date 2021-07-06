import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// The goal of the TicketDoc interface is, is to list out all the props a doc / an instance of a ticket has 
//We need the TicketDoc interface if we would like to add some additional properties in the future
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number; 
  orderId?: string; // The question mark says it's an optional prop
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// The 1st arg is an obj and we're going to list all the different props we want it to have
const ticketSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
    },
  price: {
    type: Number,
    required: true,
    },
  userId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: false // Cause when a ticket is created, it won't be associated with any order
  }
  },
   {
    toJSON: {
      transform(doc, ret) { // ret is the object that's going to be the json
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
  ticketSchema.set('versionKey', 'version');

  ticketSchema.plugin(updateIfCurrentPlugin);

  ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
  };

  const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

  export {Ticket};