import { Coupon, User, CouponChangeLog } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/error-class.utils.js";


/**
 * @api {POST} /coupons Create new coupon
 */
export const createCoupon = async (req, res, next) => {
    const { couponCode, from, till, couponAmount, couponType, Users } = req.body;

    // coupon code check
    const isCouponCodeExist = await Coupon.findOne({ couponCode })
    if (isCouponCodeExist) {
        return next(new ErrorClass("Coupon code already used", 400, "Coupon code already used"))

    }


    const newCoupon = new Coupon({
        couponCode, from, till, couponAmount, couponType, Users, createdBy: req.authUser._id
    })

    await newCoupon.save();
    // send the response
    res.status(201).json({
        message: "Coupon created successfully",
        coupon: newCoupon,
    });
};


/**
 * @api {GET} /coupons Get all coupons
 */
export const getCoupons = async (req, res, next) => {
    const { isEnabled } = req.query;    // true or false
    const filters = {};
    if (isEnabled) {
        filters.isEnabled = isEnabled === "true" ? true : false
    }
    const coupons = await Coupon.find(filters)
    res.status(200).json({ coupons })
}


/**
 * @api {GET} /coupons/:couponId Get coupon by id
 */
export const getCouponById = async (req, res, next) => {
    const { couponId } = req.params;
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
        return next(new ErrorClass("Coupon not found", 404, "Coupon not found"));
    }
    res.status(200).json({ coupon })
}


/**
 * @api {PUT} /coupons/:couponId update coupon by id
 */
export const updateCoupon = async (req, res, next) => {
    const { couponId } = req.params;
    const userId = req.authUser._id;
    const { couponCode, from, till, couponAmount, couponType, Users } = req.body;

    const coupon = await Coupon.findById(couponId)
    if (!coupon) {
        return next(new ErrorClass("Coupon not found", 404, "Coupon not found"));
    }

    const logUpdatedObject = { couponId, updatedBy: userId, changes: {} }
    if (couponCode) {
        const isCouponCodeExist = await Coupon.findOne({ couponCode })
        if (isCouponCodeExist) {
            return next(new ErrorClass("Coupon code already exist", 400, "Coupon code already exist"))
        }
        coupon.couponCode = couponCode;
        logUpdatedObject.changes.couponCode = couponCode;
    }

    if (from) {
        coupon.from = from;
        logUpdatedObject.changes.from = from;
    }

    if (till) {
        coupon.till = till;
        logUpdatedObject.changes.till = till;
    }

    if (couponAmount) {
        coupon.couponAmount = couponAmount;
        logUpdatedObject.changes.couponAmount = couponAmount;
    }

    if (couponType) {
        coupon.couponType = couponType;
        logUpdatedObject.changes.couponType = couponType;
    }

    if (Users) {
        const userIds = Users.map(u => u.userId)
        const validUsers = await User.find({ _id: { $in: userIds } })
        if (validUsers.length !== userIds.length) {
            return next(new ErrorClass("Invalid users", 400, "Invalid users"))
        }
        coupon.Users = Users;
        logUpdatedObject.changes.Users = Users;
    }

    await coupon.save();
    const log = await new CouponChangeLog(logUpdatedObject).save();
    res.status(200).json({ message: "Coupon updated", coupon, log})
}


/**
 * @api {PATCH} /coupons/:couponId Disable coupon by id
 */
export const toggleCouponStatus = async (req, res, next) => {
    const { couponId } = req.params;
    const userId = req.authUser._id;
    const { enabled } = req.body;

    const coupon = await Coupon.findById(couponId)
    if (!coupon) {
        return next(new ErrorClass("Coupon not found", 404, "Coupon not found"));
    }

    const logUpdatedObject = { couponId, updatedBy: userId, changes: {} }

    if (enabled === true) {
        coupon.isEnabled = true;
        logUpdatedObject.changes.isEnabled = true;
    }

    if (enabled === false) {
        coupon.isEnabled = false;
        logUpdatedObject.changes.isEnabled = false;
    }

    await coupon.save();
    const log = new CouponChangeLog(logUpdatedObject).save();
    res.status(200).json({ message: "Coupon updated", coupon, log})
}