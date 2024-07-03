const {instance} = require("../config/razorpay")
const Course = require("../models/Course.model")
const User = require("../models/User.model")
const {courseEnrollmentEmail} = require("../Mail/Template/courseEnrollmentEmail")
const { Mongoose } = require("mongoose")
const mailSender = require("../utils/mailSender")

//^ Capture Payment and initiate Razorpay Order
exports.capturePayment = async(req, res) => {
    try {
        /*
        ^   1. get courseId and UserId
        ^   2. validation
        ^   3. valid userId and CourseId
        ^   4. check if user already paid for this same course
        ^   5. create order
        ^   6. return res
        */

        const {course_id} = req.body
        const UserId = req.user.id;

        if(!UserId || !course_id) {
            return res.status(401).json({
                success:false,
                message: "All fields reequired"
            })
        }

        let course;
        course = await Course.findById(course_id)
        if(!course){
            return res.status(401).json({
                success:false,
                message: "Course not found"
            })
        }

        let uid = new Mongoose.Types.ObjectId(UserId);
        if(Course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message: "User is already enrolled in this course"
            })
        }

        const amount = Course.price;
        const currency = "INR"

        const options = {
            amount: amount*100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes:{
                CourseId: course_id,
                UserId
            }
        }

        //^ Initiate paymnet using razopay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse)

        return res.status(200).json({
            success:true,
            message: "Order Created !!",
            courseName: course.courseName,
            description: course.description,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Error while handling payment, creating order"
        })
    }
}

exports.verifySignature = async(req, res) => {
    try {
        const webHookSecret = "12345678";
    
        const signature = req.header("x-razorpay-signature")
    
        const shaSum = crypto.createHmac("sha256", webHookSecret)
        shaSum.update(JSON.stringify(req.body))     //^ convert shaSum Object to String format
        const digest = shaSum.digest("hex")
    
        if(digest === signature) {
            console.log("Payment Authorized");
    
            const {courseId, UserId} = req.body.payload.payent.entity.notes;    //^ destined path for notes in Order Instance to fetch these details
    
            try {
                //^ fulfill the action
    
                //^ find course and into enrolled student
                const enrolledCourse = await Course.findByIdAndUpdate(courseId, 
                                    {
                                        $push:{
                                            studentsEnrolled: UserId 
                                        }
                                    },
                                    {new: true})
                if(!enrolledCourse) {
                    return res.status(401).json({
                        success:false,
                        message: "Course not found"
                    })
                }
    
                console.log(enrolledCourse);
    
                //^ find user and add course in it
                const enrolledstudent = await User.findByIdAndUpdate(
                                        {_id: UserId},
                                        {$push: {courses: courseId}},
                                        {new: true})
                if(!enrolledstudent) {
                    return res.status(401).json({
                        success:false,
                        message: "User not found"
                    })
                }            
    
                //^ send confirmation Email to User
                const emailResponse = await mailSender(enrolledstudent.email, 
                                                "Confirmation from StudyNotion",
                                                "Congratulations, Enrolled into new course from StudyNotion"
                )
                console.log(emailResponse);
    
                return res.status(200).json({
                    success:true,
                    message: "Signature verified and Course Enrolled, Email sent !"
                })
    
    
            } catch (error) {
                return res.status(500).json({
                    success:false,
                    message: "Error occured in enrolling into new course, sending email"
                })
            }
        }
    
        else{
            return res.status(401).json({
                success:false,
                message: "Signature not verified !! Try agian"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "something went wrong while verifying signature"
        })
    }
}