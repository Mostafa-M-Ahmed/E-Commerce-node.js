/**
 *  @api { POST } / users/register Register a new user
 */

import { hashSync } from "bcrypt";
import { User, Address } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";

export const registerUser = async (req, res, next) => {
    const { username, email, password, gender, age, phone, userType, country, city, postalCode, buildingNumber, floorNumber, addressLabel } = req.body;

    // email check
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        return next(new ErrorClass("Email already exists", 400));
    }
    // hash the password
    // const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);
    // no need to hash there ==> transfered to model pre save
    
    // send email verification link
    const userInstance = new User({
        username,
        email,
        password,
        age,
        gender,
        phone,
        userType
    });

    //create new address instance
    const addressInstance = new Address({
        userId: userInstance._id,
        country,
        city,
        postalCode,
        buildingNumber,
        floorNumber,
        addressLabel,
        isDefault: true,

    })
    // create the user in db
    const newUser = await userInstance.save();

    const savedAddress = await addressInstance.save();
    // send the response
    res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: newUser, savedAddress,
    });
};


export const updateAccount = async (req, res, next) => {
    const { userId } = req.params;
    const { username, password } = req.body ;
    // find user
    const user = await User.findById(userId);
    if (!user) {
    return next(new ErrorClass("User not found", 404));
    }
    if (username) {
        user.username = username;
    }
    if (password) {
        user.password = password;
    }
    await user.save()
    res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: user,
    });
};


export const deleteAccount = async (req, res, next) => {
    const { userId } = req.params;

  // Find user by ID
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorClass("User not found", 404));
  }

  // Mark user as deleted (soft delete)
  user.isMarkedAsDeleted = true;
  await user.save();

  // Send response
  res.status(200).json({
    status: "success",
    message: "User account deleted successfully",
  });
};