import mongoose from "mongoose";
import { CouponTypes } from "../../src/Utils/constants.utils.js";

const { Schema, model } = mongoose;

const couponSchema = new Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true
    },
    couponAmount: {
        type: Number,
        required: true
    },
    couponType: {
        type: String,
        required: true,
        enum: Object.values(CouponTypes)
    },
    from: {
        type: Date,
        required: true
    },
    till: {
        type: Date,
        required: true
    },
    Users: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            maxCount: {
                type: Number,
                required: true,
                min: 1
            },
            usageCount: {
                type: Number,
                default: 0
            }
        }
    ],
    isEnabled: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export const Coupon = mongoose.models.Coupon || model("Coupon", couponSchema)