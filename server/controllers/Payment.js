const {instance} = require("../config/razorpay")
const Course = require("../models/Course.model")
const User = require("../models/User.model")
const {courseEnrollmentEmail} = require("../Mail/Template/courseEnrollmentEmail")
const { Mongoose, default: mongoose } = require("mongoose")
const mailSender = require("../utils/mailSender")
const { paymentSuccessEmail } = require("../Mail/Template/paymentSuccessEmail")
const crypto = require("crypto");

exports.capturePayment = async(req, res) => {
    const {courses} = req.body;
    const userId = req.user.id

    if(courses.length == 0)
        return res.status(404).json({
            success: false,
            message: "Please provide courses to buy"
        })
    
        let totalAmount = 0;
        for(const course_id of courses){
            let course;
            try {
                course = await Course.findById(course_id.courseId)
                if(!course){
                    return res.status(404).json({
                        success: false,
                        message: "could not find the course"
                    })
                }

                const uid = new mongoose.Types.ObjectId(userId)
                if(courses?.studentEnrolled?.includes(uid)){
                    return res.status(200).json({
                        success: false,
                        message: "Student is already enrolled in this course"
                    })
                }

                totalAmount += course.price;

            } catch (error) {
                console.log(error)
                res.status(500).json({
                    success: false,
                    message: "Internal server error while calculating total amount of courses.",
                    error: error.message
                })
            }
        }

        const options = {
            amount: totalAmount*100,
            currency: "INR",
            receipt: Math.random(Date.now()).toString(),
            notes:{
                userId
            }
        }

        
        try {
            // ^ Initiate payment using razopay
            const paymentResponse = await instance.orders.create(options);
            // console.log(paymentResponse)
            return res.status(200).json({
                success: true,
                data: paymentResponse
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message: "Error while handling payment, creating order",
                error: error.message
            })
        }
}

exports.verifySignature = async(req, res) => {
    try {
        const razorpay_order_id = req.body?.razorpay_order_id
        const razorpay_payment_id = req.body?.razorpay_payment_id
        const razorpay_signature = req.body?.razorpay_signature
        const courses = req.body?.courses
        const userId = req.user.id;
    
        if(!razorpay_payment_id || !courses || !razorpay_order_id || !razorpay_signature || !userId){
            return res.status(200).json({
                success: false,
                message: "Order data not sent to verify, payment failed"
            })
        }
    
        let body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto
                                .createHmac("sha256", process.env.RAZORPAY_SECRET)
                                .update(body.toString())
                                .digest("hex")
        
    //         const shaSum = crypto.createHmac("sha256", webHookSecret)
    //         shaSum.update(JSON.stringify(req.body))     //^ convert shaSum Object to String format
    //         const digest = shaSum.digest("hex")
    
    if(expectedSignature === razorpay_signature){
            console.log("Verified signature !!!")
            //^ enroll the student
            await enrollStudents(courses, userId, res);
            
            return res.status(200).json({
                success: true,
                message: "Payment verified"
            })
        }
    
        return res.status(200).json({
            success: false,
            message: "Payment failed"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Error while verifying signature",
            error: error.message
        })
    }
}

const enrollStudents = async(courses, userId, res) =>{
    if(!courses || !userId)
        return res.status(400).json({
            success: false,
            message: "Please provide data for courses or userid"
    })

    for(const course of courses){
        try {
            //^ find course and enroll student in it
            const enrolledCourse = await Course.findByIdAndUpdate(
                        {_id: course.courseId}, 
                        {$push: {
                            studentsEnrolled: userId
                        }},
                        {new: true}
            )
    
            if(!enrolledCourse){
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                })
            }
    
            //^ find student, add course to their enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(
                        {_id: userId},
                        {$push: {
                            courses: course.courseId
                        }},
                        {new: true}
            )
    
            if(!enrolledStudent){
                return res.status(404).json({
                    success: false,
                    message: "Student not found"
                })
            }
    
            //^ send mail to student
            const emailresponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            )
    
            console.log("Course Enrollment Email sent broooo")
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message: "Error while enrolling student into the course",
                error: error.message
            })
        }
    }
}

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;
    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(404).json({
            success: false,
            message: "All fields are required while sending email for successful payment"
        })
    }

    try {
        const enrolledStudent = await User.findById(userId);
        await mailSender(
                enrolledStudent.email,
                'Payment Received',
                paymentSuccessEmail(`${enrolledStudent.firstName}`, amount/100, orderId, paymentId)
        )
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Error while sending success email for payment",
            error: error.message
        })
    }
}





//& This is payment controller but only for 1 object to be bought, not multiple, like cart system.

//^ Capture Payment and initiate Razorpay Order
// exports.capturePayment = async(req, res) => {
//     try {
        /*
        ^   1. get courseId and UserId
        ^   2. validation
        ^   3. valid userId and CourseId
        ^   4. check if user already paid for this same course
        ^   5. create order
        ^   6. return res
        */

//         const {course_id} = req.body
//         const UserId = req.user.id;

//         if(!UserId || !course_id) {
//             return res.status(401).json({
//                 success:false,
//                 message: "All fields reequired"
//             })
//         }

//         let course;
//         course = await Course.findById(course_id)
//         if(!course){
//             return res.status(401).json({
//                 success:false,
//                 message: "Course not found"
//             })
//         }

//         let uid = new Mongoose.Types.ObjectId(UserId);
//         if(Course.studentsEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success:false,
//                 message: "User is already enrolled in this course"
//             })
//         }

//         const amount = Course.price;
//         const currency = "INR"

//         const options = {
//             amount: amount*100,
//             currency,
//             receipt: Math.random(Date.now()).toString(),
//             notes:{
//                 CourseId: course_id,
//                 UserId
//             }
//         }

        //^ Initiate paymnet using razopay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse)

//         return res.status(200).json({
//             success:true,  
//             message: "Order Created !!",
//             courseName: course.courseName,
//             description: course.description,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount
//         })

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message: "Error while handling payment, creating order"
//         })
//     }
// }

// exports.verifySignature = async(req, res) => {
//     try {
//         const webHookSecret = "12345678";
    
//         const signature = req.header("x-razorpay-signature")
    
//         const shaSum = crypto.createHmac("sha256", webHookSecret)
//         shaSum.update(JSON.stringify(req.body))     //^ convert shaSum Object to String format
//         const digest = shaSum.digest("hex")
    
//         if(digest === signature) {
//             console.log("Payment Authorized");
    
//             const {courseId, UserId} = req.body.payload.payent.entity.notes;    //^ destined path for notes in Order Instance to fetch these details
    
//             try {
                    //^ fulfill the action
        
                    //^ find course and into enrolled student
//                 const enrolledCourse = await Course.findByIdAndUpdate(courseId, 
//                                     {
//                                         $push:{
//                                             studentsEnrolled: UserId 
//                                         }
//                                     },
//                                     {new: true})
//                 if(!enrolledCourse) {
//                     return res.status(401).json({
//                         success:false,
//                         message: "Course not found"
//                     })
//                 }
    
//                 console.log(enrolledCourse);
    
//                 //^ find user and add course in it
//                 const enrolledstudent = await User.findByIdAndUpdate(
//                                         {_id: UserId},
//                                         {$push: {courses: courseId}},
//                                         {new: true})
//                 if(!enrolledstudent) {
//                     return res.status(401).json({
//                         success:false,
//                         message: "User not found"
//                     })
//                 }            
    
//                 //^ send confirmation Email to User
//                 const emailResponse = await mailSender(enrolledstudent.email, 
//                                                 "Confirmation from StudyNotion",
//                                                 "Congratulations, Enrolled into new course from StudyNotion"
//                 )
//                 console.log(emailResponse);
    
//                 return res.status(200).json({
//                     success:true,
//                     message: "Signature verified and Course Enrolled, Email sent !"
//                 })
    
    
//             } catch (error) {
//                 return res.status(500).json({
//                     success:false,
//                     message: "Error occured in enrolling into new course, sending email"
//                 })
//             }
//         }
    
//         else{
//             return res.status(401).json({
//                 success:false,
//                 message: "Signature not verified !! Try agian"
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({
//             success:false,
//             message: "something went wrong while verifying signature"
//         })
//     }
// }