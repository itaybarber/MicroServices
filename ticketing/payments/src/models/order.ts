import { OrderStatus } from '@itay_tix/common/build/index';
import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
};  

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  stauts: OrderStatus;
};

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs) : OrderDoc;

} 

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    requiered: true,
  },
  status: {
    type: String,
    requiered: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created 
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    status: attrs.status,
    price: attrs.price,
    userId: attrs.userId
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};