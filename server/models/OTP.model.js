const mailSender = require("../utils/mailSender");
const mongoose = require('mongoose');
const emailVerificationTemplate = require("../Mail/Template/emailVerificationTemplate")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60,
    }
})

//^ Below OTPSchema and above OTPModel
//^ Function -- To Send Email
async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(email, "Verification Email from BrahmGyaani", emailVerificationTemplate(otp))
        console.log("Email sent successfully")
    } catch (error) {
        console.log("error occured while sending mail", error)
        throw(error)
    }
}

//^ Pre Middleware for this
otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", otpSchema)