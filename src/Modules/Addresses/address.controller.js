import { Address } from "../../../DB/Models/index.js";


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

/**
 * @api {DELETE} /addresses/delete/:id Delete address by id
 */

/**
 * @api {GET} /addresses Get all addresses
 */