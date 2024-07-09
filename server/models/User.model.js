/* eslint-disable no-undef */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
    },
    accountType:{
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        required: true
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Profile",
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }
    ],
    image: {
        type: String,
        // required: true,
    },
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress",
        }
    ],
    token: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema)