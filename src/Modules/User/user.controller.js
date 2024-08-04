/**
 *  @api { POST } / users/register Register a new user
 */

import { hashSync } from "bcrypt";
import { User } from "../. ./../DB/Mode1s/index.js";
import { ErrorClass } from "../. ./Uti1s/index.js";

export const registerUser = async (req, res, next) => {
    const { username, email, password, gender, age, phone, userType } = req.body;

    // email check
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        return next(new ErrorClass("Email already exists", 400));
    }
    // hash the password
    // const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);
    // no need to hash there ==> transfered to model pre save
    
    // send email verification link
    const userObject = new User({
        username,
        email,
        password,
        age,
        gender,
        phone,
        userType
    });

    // create the user in db
    // const newUser = await User.create(userObject);
    const newUser = await userObject.save();

    // send the response
    res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: newUser,
    });
};


export const updateAccount = async (req, res, next) =>{
    const { userId } = req.params;
    const { username, password } = req. body ;
    // find suer
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