
const User = require('../models/User.model')
const OTP = require('../models/OTP.model')
const Profile = require('../models/Profile.model')
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// const { response } = require('express')
const mailSender = require("../utils/mailSender");
require("dotenv").config()

//& send otp
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        //   console.log("email --------------------->", req.body)
        if (!email)
            return res.status(404).json({
                success: false,
                message: "Email not found"
            })
        const checkuserpresent = await User.findOne({ email });
        if (checkuserpresent) {
            return res.status(400).json({
                status: false,
                message: "User already Exist",
            });
        }

        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("otp generated", otp);

        //check uniqueness of otp
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };
        // console.log(otpPayload);

        //create an entry in db for otp
        await OTP.create(otpPayload);
        //  return response
        return res.status(200).json({
            success: true,
            messgae: "OTP sent successfully",
            otp
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            success: false,
            message: "Something Went Wrong",
        });
    }
};

//& sign up
exports.signUp = async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, confirmpassword, accountType, contactNumber, otp
        } = req.body

        //^ validate data
        if (!firstName || !lastName || !email || !password || !confirmpassword || !accountType || !otp)
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })

        if (password !== confirmpassword)
            return res.status(400).json({
                success: false,
                message: "Password and confirmpassword do not match"
            })

        //^ check existence of user
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        //^ Find Most recent OTP
        // const recentOtp = OTP.find({email}).sort({createdAt:-1})[0];
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        // console.log(response);
        if (response.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
                success: false,
                message: "Enter OTP",
            });
        } else if (otp !== response[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
                redirect: "/verify-email"
            });
        }

        //^ Hashing Password
        const hashedPassword = await bcrypt.hash(password, 10)


        //^ Create Object in DB
        const profileDetail = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        console.log("otp verified");
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetail._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}_${lastName}`,   //^ to create a user image based on theor initials
        })

        return res.status(200).json({
            success: true,
            message: "User created",
            user
        })
    }
    catch (error) {
        console.log(error)
        return res.status(401).json({
            success: false,
            message: "Error occured during signup process. Try Again"
        })
    }

}

//& login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email | !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email }).populate("additionalDetails");

        if (!user)
            return res.status(401).json({
                success: false,
                message: "User not found. Sign Up First"
            })

        //^ compare password and genearte JWT Token
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            })

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            console.log("logged in");

            res.cookie("token", token, options).status(201).json({
                success: true,
                user,
                token,
                message: "Logged In Successfully !"
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error occured during Login!!"
        })
    }
}

//& changePassword
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { password, newPassword, confirmpassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			password,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmpassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				"passwordUpdated",
                (
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};