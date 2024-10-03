import mongoose from "../global-setup.js";
import { hashSync } from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        userType: {
            type: String,
            required: true,
            enum: ["Buyer", "Admin"],
        },
        age: {
            type: Number,
            required: false,
        },
        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: false,
        },
        phone: {
            type: String,
            required: false
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isMarkedAsDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);


//============================= Document Middleware ===========================//

userSchema.pre("save", function (next) {
    // console.log("=======================PRE HOOK=============================");
    if (this.isModified("password")) {
    this.password = hashSync(this.password, +process.env.SALT_ROUNDS);
    }
    next();
});

userSchema.pre("updateOne", { document: true, query: false }, function(next) {
    // console.log("====================PRE update hook==========================");
    next();
});


//============================= Query Middleware ===========================//
userSchema.pre(["updateOne", "findOneAndUpdate"], function(next) {
    // console.log("====================PRE update hook==========================");
    // console.log(this.getQuery());
    // console.log(this.getFilter());
    // console.log(this.getOptions());
    // console.log(this.getUpdate());
    next();
});


export const User = mongoose.models.User || model("User", userSchema);