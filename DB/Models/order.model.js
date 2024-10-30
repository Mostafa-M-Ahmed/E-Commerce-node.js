import mongoose from "mongoose";
import { OrderStatus, PaymentMethods } from "../../src/Utils/index.js";
const { Schema, model } = mongoose;

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    fromCart: {
        type: Boolean,
        default: true
    },
    address: String,
    addressId: {
        type: Schema.Types.ObjectId,
        ref: "Address"
    },
    contactNumber: {
        type: String,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        required: true
    },
    VAT: {
        type: Number,
        required: true
    },
    couponId: {
        type: Schema.Types.ObjectId,
        ref: "Coupon"
    },
    total: {
        type: Number,
        required: true
    },
    estimatedDeliveryDate: {
        type: Date,
        required: true
    },
    paymentMethods: {
        type: String,
        required: true,
        enum: Object.values(PaymentMethods)
    },
    orderStatus: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus)
    },
    deliveredBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    cancelledBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    deliveredAt: Date,
    cancelledAt: Date,
}, { timestamps: true });

export const Order = mongoose.models.Order || model("Order", orderSchema)