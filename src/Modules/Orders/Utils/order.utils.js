import { DateTime } from "luxon"
import { Coupon } from "../../../../DB/Models/index.js"
import { DiscountType } from "../../../Utils/constants.utils.js"

/**
 * 
 * @param {*} couponCode 
 * @param {*} userId 
 * @returns {message: string, error: Boolean, coupon: Object}
 */
export const validateCoupon = async (couponCode, userId) => {
    // get coupon by coupon code
    const coupon = await Coupon.findOne({ couponCode })
    if (!coupon) {
        return { message: "Invalid coupon code", error: true }
    }

    // check if coupon is enabled
    if (!coupon.isEnabled || DateTime.now() > DateTime.fromJSDate(coupon.till)) {
        return { message: "Coupon is not enabled", error: true }
    }

    // check if coupon not started yet
    if (DateTime.now() < DateTime.fromJSDate(coupon.from)) {
        return { message: `Coupon will be valid starting from ${coupon.from}`, error: true }
    }

    // check if user not eligible to use coupon
    const isUserNotEligible = coupon.Users.some(u => u.userId.toString() !== userId.toString() || (u.userId.toString() === userId.toString() && u.maxCount <= u.usageCount))
    if(isUserNotEligible) {
        return { message: "User is either not eligible to use this coupon or has redeemed all their tries", error: true}
    }

    return {error: false, coupon}
}



export const applyCoupon = (subTotal, coupon) => {
    let total = subTotal;
    const { couponAmount: discountAmount, couponType: discountType } = coupon;

    if (discountAmount && discountType) {
        if (discountType === DiscountType.Percentage) {
            total = subTotal - (subTotal * discountAmount / 100);
        } else if (discountType === DiscountType.Amount) {
            if (discountAmount > subTotal) {
                return total;
            }
            total = subTotal - discountAmount;
        }
    }
    return total;
};