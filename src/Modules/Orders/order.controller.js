import { DateTime } from "luxon";
import { Address, Cart, Order } from "../../../DB/Models/index.js";
import { ErrorClass, OrderStatus, PaymentMethod } from "../../Utils/index.js";
import { calculateCartTotal } from "../Cart/Utils/cart.utils.js";
import { applyCoupon, validateCoupon } from "./Utils/order.utils.js";


export const createOrder = async (req, res, next) => {
    const userId = req.authUser._id;
    const { address, addressId, contactNumber, couponCode, shippingFee, VAT, paymentMethod } = req.body;

    // id cart empty
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || !cart.products.length) {
        return next(new ErrorClass("Cart is empty", 400, "Cart is empty"))
    }

    // checks if any product inside cart is sold out
    const isSoldOut = cart.products.find((p) => p.productId.stock < p.quantity);

    // const isSoldOut = cart.products.find((p) => {
    //     if(p.productId.stock < p.quantity)
    //     return p;
    // });
    if (isSoldOut) {
        return next(new ErrorClass(`Product ${isSoldOut.productId.title} is sold out`, 400, "Product is sold out"))
    }

    const subTotal = calculateCartTotal(cart.products);
    let total = subTotal + shippingFee + VAT;

    let coupon = null;
    if (couponCode) {
        const isCouponValid = await validateCoupon(couponCode, userId);
        // console.log(isCouponValid);
        if (isCouponValid.error) {
            return next(new ErrorClass(isCouponValid.message, 400, isCouponValid.message))
        }
        coupon = isCouponValid.coupon;
        total = applyCoupon(subTotal, coupon)
    }

    if (!address && !addressId) {
        // check if addressId is valid
        const addressInfo = await Address.findOne({ _id: addressId, userId });
        if (!addressInfo) {
            return next(new ErrorClass("Invalid address", 400, "Invalid address"))
        }
    }

    let orderStatus = OrderStatus.Pending;
    if (paymentMethod === PaymentMethod.Cash) {
        orderStatus = OrderStatus.Placed;
    }

    const orderObj = new Order({
        userId,
        products: cart.products,
        address,
        addressId,
        contactNumber,
        subTotal,
        shippingFee,
        VAT,
        couponId: coupon?._id,
        total,
        paymentMethod,
        orderStatus,
        estimatedDeliveryDate: DateTime.now().plus({ days: 7 }).toFormat("yyyy-MM-dd"),
    })

    await orderObj.save()

    // clear the cart
    cart.products = [];
    await cart.save();

    res.status(201).json({ message: "order created successfully", order: orderObj });
}