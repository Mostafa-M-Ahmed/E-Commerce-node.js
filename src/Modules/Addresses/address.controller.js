import { Address } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/error-class.utils.js";


/**
 * @api {POST} /addresses Add new address
 */
export const addAddress = async (req, res, next) => {
    const { country, city, postalCode, buildingNumber, floorNumber, addressLabel, setAsDefault } = req.body;     //setAsDefault from frontend
    const userId = req.authUser._id;    //user must be logged in

    //create new address instance
    const newAddress = new Address({
        userId,
        country,
        city,
        postalCode,
        buildingNumber,
        floorNumber,
        addressLabel,
        isDefault: [true, false].includes(setAsDefault) ? setAsDefault : false
    })

    //if the new address is default, we need to update the old default address to be not default
    if (newAddress.isDefault) {
        await Address.updateOne({ userId, isDefault: true }, { isDefault: false })
    }

    const address = await newAddress.save();
    // send the response
    res.status(201).json({
        status: "success",
        message: "Address created successfully",
        data: address,
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
