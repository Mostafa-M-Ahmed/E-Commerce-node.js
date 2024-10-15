import { Coupon, User } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/error-class.utils.js";


/**
 * @api {POST} /addresses Add new address
 */
export const createCoupon = async (req, res, next) => {
    const { couponCode, from, till, couponAmount, couponType, Users } = req.body;     //setAsDefault from frontend

    // coupon code check
    const isCouponCodeExist = await Coupon.findOne({ couponCode })
    if (isCouponCodeExist) {
        return next(new ErrorClass("Coupon code already used", 400, "Coupon code already used"))

    }

    const userIds = Users.map(u => u.userId)    // [userId1, userId2]
    const validUsers = await User.find({ _id: { $in: userIds } })
    if (validUsers.length !== userIds.length) {
        return next(new ErrorClass("Invalid users", 400, "Invalid users"))
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
 * @api {PUT} /addresses/edit/:id Edit address by id
 */
export const editAddress = async (req, res, next) => {
    const { country, city, postalCode, buildingNumber, floorNumber, addressLabel, setAsDefault } = req.body;     //setAsDefault from frontend
    const userId = req.authUser._id;    //user must be logged in
    const { addressId } = req.params

    const address = await Address.findOne({ _id: addressId, userId, isMarkedAsDeleted: false })
    if (!address) {
        return next(new ErrorClass("Address not found", 404, "Address not found"))
    }

    if (country) address.country = country;
    if (city) address.city = city;
    if (postalCode) address.postalCode = postalCode;
    if (buildingNumber) address.buildingNumber = buildingNumber;
    if (floorNumber) address.floorNumber = floorNumber;
    if (addressLabel) address.addressLabel = addressLabel;
    if ([true, false].includes(setAsDefault) ? setAsDefault : false) {
        address.isDefault = [true, false].includes(setAsDefault) ? setAsDefault : false
        await Address.updateOne({ userId, isDefault: true }, { isDefault: false })
    }

    await address.save()
    res.status(200).json({ message: "Address updated", address })
}


/**
 * @api {DELETE} /addresses/delete/:id Delete address by id
 */
export const deleteAddress = async (req, res, next) => {
    const userId = req.authUser._id;    //user must be logged in
    const { addressId } = req.params

    const address = await Address.findOneAndUpdate(
        { _id: addressId, userId, isMarkedAsDeleted: false },
        { isMarkedAsDeleted: true, isDefault: false },
        { new: true }
    )
    if (!address) {
        return next(new ErrorClass("Address not found", 404, "Address not found"))
    }

    res.status(200).json({ message: "Address deleted", address })
}

/**
 * @api {GET} /addresses Get all addresses
 */
export const getAddresses = async (req, res, next) => {
    const userId = req.authUser._id;    //user must be logged in
    const addresses = await Address.find({ userId, isMarkedAsDeleted: false })
    res.status(200).json({ addresses })
}