const RatingReview = require("../models/RatingAndReview.model")
const Course = require("../models/Course.model");

//& Create rating
exports.createRating = async(req, res) => {
    try {
        /*
        ^    1. get data, courseId from req.body
        ^    2. get userId
        ^    3. validate dta and check user exists
        ^    4. check if user already has given review
        ^    5. create Rating object
        ^    6. update Course and add rating of that course
        ^    7. return res
        */

        const userId = req.user.id;
        const {courseId, review, rating} = req.body

        const courseDetail = await Course.findOne({
                                    _id: courseId, 
                                    studentsEnrolled:{$elematch: {$eq: userId}}
        })
        if(!courseDetail)
            return res.status(500).json({
                success: false,
                message: "Student not enrolled in course",            
            })

        const alreadyReviewed = await RatingReview.findOne({
                                user: userId,
                                course: courseId
        })
        if(alreadyReviewed) {
            return res.status(200).json({
                success: false,
                message: "User has already reviewed this course",            
            })
        }

        const newrating = RatingReview.create({
                user: userId,
                course: courseId,
                rating, review
        })

        const updatedCourseDeatils = await Course.findByIdAndUpdate({_id:courseId},
                                {$push: {
                                    ratingAndReviews: newrating._id
                                }},
                                {new: true}
        )
        // console.log(updatedCourseDeatils);

        return res.status(200).json({
            succss: true,
            message: "rating Created successfully",
            data: newrating
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong with creating Review",           
        })
    }
}


//& Get Average rating
exports.getAverageRating = async(req, res) => {
    try{
        const courseid = req.body.courseId;

        const result = await RatingReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseid),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"}        //^ tp calculate avg rating of all reviews
                }
            }
        ])
        
        if(result.length > 0){            
            return res.status(200).json({
                success: true,
                message: `Average Rating of this course is ${result[0].averageRating}`,
                averageRating: result[0].averageRating
            })
        }

        else{
            return res.status(200).json({
                success: true,
                message: `Average Rating of this course is 0`,
                averageRating: 0
            })
        }
    }

    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong with calcukating Avg rating",            
        })
    }
}

//& Get All rating
exports.getAllRating = async(req, res) => {
    try{
        const allReviews = await RatingReview.find({})
                                .sort({rating: "desc"})
                                .populate({
                                    path: "user",
                                    select: "firstName, lastName, email, image",
                                })
                                .populate({
                                    path: "course",
                                    select: "courseName"
                                })
                                .exec()
        
        return res.status(200).json({
            success: true,
            message: 'All reviews fetched successfully',
            data: allReviews
        })
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong with fetching all reviews",            
        })
    }
}