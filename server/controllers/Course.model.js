const Course = require("../models/Course.model")
const Category = require("../models/Category.model")
const User = require("../models/User.model")

const {uploadImageToCloudinary} = require("../utils/imageUploader")

//& Create Course Handler
exports.createCourse =  async(req, res) => {
    try {
        const {courseName, courseDescription, price, whatYouWillLearn, category} = req.body;     //^ here category is ObjectId of category model
        const thumbnail = await req.files.thumbnailImage

        if(!courseName || !courseDescription || !price || !whatYouWillLearn || !category || !thumbnail) {
            return res.status(402).json({
                success: false,
                message: "All foelds are required"
            })
        }

        const userid = req.user.id         //^ received due to addition of id in user in payload in auth LOGIN controller
        const instructorDetail = await User.findById(userid, {
			accountType: "Instructor",
		});   
                //^ we are extracting this, even though we know only user can access this controller, to passs the instructor id to the course model.
        
        //TODO: check if user.id === instructorDetail._id       
        

        if(!instructorDetail)
            return res.status(401).json({
                success: false,
                message: "Instructur detail not found"
            })            
        // console.log(instructorDetail)
            
        const categoryDetail = await Category.findById(category)
        if(!categoryDetail)
            return res.status(401).json({
                success: false,
                message: "Invalid category, details not found"
            })

        //^ Upload image on cloudinary
        const ThumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        //^ creating Course Object
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetail._id,
            category: categoryDetail._id,
            price,
            whatYouWillLearn,
            thumbnail: ThumbnailImage
        })

        //^ updating user by adding course into user schema
        await User.findByIdAndUpdate(
                {_id: instructorDetail._id},
                {
                    $push: {courses: newCourse._id}
                },
                {new: true}
        )

        //^ Update category Schema
        await Category.findByIdAndUpdate(
                    {_id: categoryDetail._id},
                    {
                        $push:{courses: newCourse._id}
                    },
                    {new: true}                  
        )


        return res.status(200).json({
            success: true,
            message: "New course added successfully",
            data: newCourse
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding new course.",
            error: error.message
        })
    }
}


//& getAllCourses Handler
exports.showAllCourses = async(req, res) => {
    try {
        const allCourses = await Course.find({}, {
                        coursename: true, 
                        // courseDescription: true, 
                        price: true, 
                        instructor: true, 
                        thumbnail: true,
                        ratingAndReviews: true, 
                        studentsEnrolled: true,
                        category: true
                    })
                    .populate("instructor")
                    .populate({
                        path: "courseContent",
                        populate: "subSection"
                    })
                    .exec()         //^ returns a promise

        if(!allCourses)
            return res.status(401).json({
                success: false,
                message: "No course found",
            })
        
        return res.status(200).json({
            success: true,
            message: "Courses found and displayed successfully",
            data: allCourses
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Cannot fetch course data while getting all course.",
            error: error.message
        })
    }
}

//& getCourseDetails Handler
exports.getCourseDetails = async (req, res) => {
    try {
        // get id
        const { courseId } = req.body;
        // find course detail
        const courseDetail = await Course.find({_id: courseId})
            .populate({
                path: "instructor",
                populate: {path: "additionalDetails"}})
            .populate({ path: "Category" })
            .populate({ path: "ratingAndReviews" })
            .populate({
                path: "courseContent",
                populate: {path: "subSection"}})
            .exec();

        //validation
        if (!courseDetail) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with this course id ${courseId}`
            })
        }
        //return  response
        return res.status(200).json({
            success: true,
            message: "Course Details fetched successfully ",
            data: courseDetail
        })
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong with getCourseDetails Handler",
            
        })
    }
}