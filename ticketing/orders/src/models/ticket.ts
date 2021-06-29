import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>; // The Promise resolves with a bool
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs) : TicketDoc;
  findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>; // The method will be implemented in the statics objects in ticketSchema
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true,
  },

  price: {
    type: Number,
    required: true,
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

ticketSchema.set('versionKey', 'version'); // For doing the versioning stuff;
ticketSchema.plugin(updateIfCurrentPlugin);

// Deprecated but nice to keep about versioning:
/*
//                         // We must use the function keyword, cause like many other middlewares, in mongoose,
//                         // the value of the doc we're trying to save, is available inside this function as "this"
//                         // and an arrow function, will override the "this" inside the function
//                         // Done is a callback function we have to invoke manually
//                         // In this function, we're going to change on the fly the this.$where prop (see https://stackoverflow.com/questions/21919584/does-the-dollar-sign-when-used-in-a-string-mean-anything-special-regarding-arr/21919768)
//                         // so we're going to add additional criteria on the save operation -> on
//                         // how mongoose is going to find the record to update inside MongoDB
// ticketSchema.pre('save', function (done) {
//   this.$where = {  
//     version: this.get('version') - 1
//   };

//   done();
// });
*/

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1 // The -1 is cause that's how we will see if the previous version of the ticket, exists in our TicketDoc
  });
}
// The statics object is how we add new method directly to the ticket model
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.methods.isReserved = async function () {
  // this === the ticketDoc that we just called 'isReserved' on
  // That's why we need to use the keyword function, not to mess up with "this"

  // Run query to look at all orderes and to find an order where the ticket
  // is the ticket we found above & the order stat is not cancelled
const existingOrder = await Order.findOne({
  
  ticket: this.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AWaitingPayment,
        OrderStatus.Complete,
        
      ],
    },
  });

  return !!existingOrder; // If it will be null, it will flip it to true, then to false;
};

// The ticket model is the object that get us access to the overall collection
const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket', ticketSchema);

export {Ticket}; 