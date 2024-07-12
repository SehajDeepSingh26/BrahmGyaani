const jwt = require('jsonwebtoken');
require("dotenv").config();
const user = require('../models/User.model')

// auth
exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorisation")?.replace("Bearer ", "");
                        
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token not found"
            })
        }
    
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating token"
        })
    }
}   


// isStudent
exports.isStudent = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students only"
            })
        }
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User role not verified, please try again"
        })
    }
}

// isInstructor
exports.isInstructor = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor only"
            })
        }
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User role not verified, please try again"
        })
    }
}

// isAdmin
exports.isAdmin = async(req, res, next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only"
            })
        }
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User role not verified, please try again"
        })
    }
}