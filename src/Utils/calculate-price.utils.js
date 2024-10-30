import { DiscountType } from "./index.js";

/**
 *
 * @param {number} price  - number
 * @param {object} discount  - {amount: number, type: string}
 * @returns  number - calculated price
 * @description  calculate the product price based on the discount type and amount
 */

export const calculateProductPrice = (price, discount) => {
    let appliedPrice = price;
    const { amount: discountAmount, type: discountType } = discount;
    if (discountAmount && discountType) {
        if (discountType === DiscountType.Percentage) {
            appliedPrice = price - (price * discountAmount) / 100;
        } else if (discountType === DiscountType.Amount) {
            appliedPrice = price - discountAmount;
        }
    }
    return appliedPrice;
};