const Course = require("../models/Course.model")
const Category = require("../models/Category.model")
const User = require("../models/User.model")

const { uploadImageToCloudinary } = require("../utils/imageUploader")
const { convertSecondsToDuration } = require("../utils/secToDuration")
const Section = require("../../compare/StudyNotion11/server/models/Section")


//& Create Course Handler
exports.createCourse = async (req, res) => {
    try {
        let {
            courseName,
            courseDescription,
            price,
            whatYouWillLearn,
            category,       //^ here category is ObjectId of category model
            tag: _tag,
            instructions: _instructions,
            status
        } = req.body;

        const thumbnail = await req.files.thumbnailImage

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)


        if (!courseName || !courseDescription || !price || !whatYouWillLearn || !category || !thumbnail || !tag || !instructions) {
            return res.status(402).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (!status || status === undefined)
            status = "Draft"

        const userid = req.user.id         //^ received due to addition of id in user in payload in auth LOGIN controller
        const instructorDetail = await User.findById(userid, {
            accountType: "Instructor",
        });
        //^ we are extracting this, even though we know only user can access this controller, to passs the instructor id to the course model.

        //TODO: check if user.id === instructorDetail._id       


        if (!instructorDetail)
            return res.status(401).json({
                success: false,
                message: "Instructor detail not found"
            })
        // console.log(instructorDetail)

        const categoryDetail = await Category.findById(category)
        if (!categoryDetail)
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
            tag,
            whatYouWillLearn,
            thumbnail: ThumbnailImage.secure_url,
            status: status,
            instructions
        })

        //^ updating user by adding course into user schema
        await User.findByIdAndUpdate(
            { _id: instructorDetail._id },
            {
                $push: { courses: newCourse._id }
            },
            { new: true }
        )

        //^ Update category Schema
        await Category.findByIdAndUpdate(
            { _id: categoryDetail._id },
            {
                $push: { courses: newCourse._id }
            },
            { new: true }
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

//& Edit Course handler
exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const updates = req.body;
        const course = await Course.findById(courseId);

        if (!course)
            return res.status(404).json({
                success: false,
                message: "Course not found !!"
            })

        if (req.files && req.files.thumbnailImage) {
            const thumbnail = req.files.thumbnailImage;
            const uploadThumbnail = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

            course.thumbnail = uploadThumbnail.secure_url
        }

        //^ update fields that are present in req.body
        for (const key in updates) {
            // eslint-disable-next-line no-prototype-builtins
            if (updates.hasOwnProperty(key)) {
              if (key === "tag" || key === "instructions") {
                course[key] = JSON.parse(updates[key])
              } 
              else {
                course[key] = updates[key]
              }
            }
          }
          
        await course.save();

        const updatedCourse = await Course.findOne({ _id: courseId })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internbal Server error while updating course",
            error: error
        })
    }
}


//& getAllCourses Handler
exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({ status: "Published" }, {
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
                populate: {
                    path: "subSection"
                }
            })
            .exec()         //^ returns a promise

        if (!allCourses)
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
        const courseDetail = await Course.findOne({ _id: courseId })
            .populate({
                path: "instructor",
                populate: { path: "additionalDetails" }
            })
            .populate({ path: "category" })
            .populate({ path: "ratingAndReviews" })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    select: "-videoUrl"
                }
            })
            .exec();

        //validation
        if (!courseDetail) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with this course id ${courseId}`
            })
        }

        if (courseDetail.status === "Draft") {
            return res.status(400).json({
                success: false,
                message: `Accessing draft course is forbidden`
            })
        }

        let totalDurationInSeconds = 0;
        courseDetail.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        //return  response
        return res.status(200).json({
            success: true,
            message: "Course Details fetched successfully ",
            data: { courseDetail, totalDuration }
        })
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong with getCourseDetails Handler",
            error: error
        })
    }
}

exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.user.id
        const courseDetails = await Course.findOne({
            _id: courseId,
        })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        // let courseProgressCount = await CourseProgress.findOne({
        //     courseID: courseId,
        //     userId: userId,
        // })

        // console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        let totalDurationInSeconds = 0
        courseDetails.courseContent?.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                // completedVideos: courseProgressCount?.completedVideos
                    // ? courseProgressCount?.completedVideos
                    // : [],
            },
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error,
        })
    }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id

        const instructorCourses = await Course.find({
            instructor: instructorId,
        }).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            data: instructorCourses,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error,
        })
    }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, {
                $pull: { courses: courseId },
            })
        }

        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            // Delete the section
            await Section.findByIdAndDelete(sectionId)
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}