import mongoose from "mongoose";
import { calculateCartTotal } from "../../src/Modules/Cart/Utils/cart.utils.js";

const { Schema, model } = mongoose;

const cartSchema = Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    subTotal: Number


}, { timestamp: true });

cartSchema.pre('save', function(next) {
    this.subTotal = calculateCartTotal(this.products);
    // console.log(`calculating subTotal before save: ${this.subTotal}`);
    next();
})

cartSchema.post('save', async function(doc) {
    if (doc.products.length === 0) {
        await Cart.deleteOne({ userId: doc.userId });
    }
})

export const Cart = mongoose.models.Cart || model("Cart", cartSchema);