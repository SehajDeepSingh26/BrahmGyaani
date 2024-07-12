/* eslint-disable no-undef */
const User = require('../models/User.model');
const mailSender = require('../utils/mailSender')
const bcrypt = require("bcrypt")

//& resetPasswordToken -- will send mail of Frontend link in mail to user
exports.resetPasswordToken = async(req, res) => {
    try {
        //^ get email from req.body
        const {email} = req.body;
        if(!email){
            return res.status(401).json({
                success: false,
                message: "Enter email address"
            })
        }
        // console.log(email);
    
        //^ verify user
        const user = await User.find({email:email})
        if( !user )
            return res.status(401).json({
                success: false,
                message: "User not found, please sign up"
            })
    
        //^ Generate Token
        const token = crypto.randomUUID()
        // console.log(crypto);
    
        //^ update user by adding token and expirationTime
        const updateUser = await User.findOneAndUpdate(
                                            {email:email}, 
                                            {
                                                token: token, 
                                                resetPasswordExpires: Date.now() + 5*60*1000
                                            },
                                            {new:true})     //^ returns the updated user to updateUser variable
    
        //^ send email containing the url
        const url = `http://localhost:5173/update-password/${token}`
        mailSender(email, "Reset Password Link", `The Link for Reset Password: ${url}`)
    
        //^ send response
        return res.status(201).json({
            success: true,
            message: "Password Reset Link sent to your email successfully, Please check",
            updateUser
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending email for reseting password",
            error: error.message
        })
    }
}

//& reset Password
exports.resetPassword = async(req, res) => {
    try {
        const {password, confirmpassword, token} = req.body      //^ token is sent into body from frontend

        //^ validate user
        if(!password || !confirmpassword || !token) {
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (confirmpassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
    
        const userDetail = await User.findOne({token});
        
        if(!userDetail){
            return res.status(402).json({
                success: false,
                message: "Invalid Token, please generate again",
            })
        }

        //^ check expiryTime of User
        if(User.resetPasswordExpires < Date.now()) {
            if(!userDetail){
                return res.status(402).json({
                    success: false,
                    message: "Token expired, please generate again"
                })
            }
        }

        //^ Hash password
        const pass = await bcrypt.hash(confirmpassword, 10)

        //^ update password
        await User.findOneAndUpdate(
                            {token: token},
                            {password: pass,
                                // token: null,
                            },
                            {new: true}
                        )
        //^ return response
        return res.status(201).json({
            success: true,
            message: "Password updated, Reset done"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reseting password",
            error: error.message
        })
    }
}