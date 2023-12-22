import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true, default: 1 },
  }],
});

const cartModel = model("Cart", cartSchema);

export { cartModel };
