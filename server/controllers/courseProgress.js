const CourseProgress = require('../models/CourseProgress.model');
const SubSection = require('../models/SubSection.model');


exports.updateCourseProgress = async(req, res) => {
    const {courseId, subSectionId} = req.body;
    const userId = req.user.id;
    try {
        //^ check subSectionvalidity
        // console.log("CourseProgress started")
        const subSection = await SubSection.findById(subSectionId)
        if(!subSection)
            return res.status(404).json({
                success: false,
                message: " course is invalid"})
        
        let courseProgress = await CourseProgress.findOne({
            courseId: courseId,
            userId: userId}
        )
        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "Course progress does not exist "})
        }
        // console.log("CourseProgress chl rha hai")


        if(courseProgress.completedVideos.includes(subSectionId)){
            return res.status(400).json({
                success: false,
                message: "subSection already marked completed"})
        }

        courseProgress.completedVideos.push(subSectionId)

        await courseProgress.save();
        // console.log("CourseProgress hogya")

        return res.status(200).json({
            success: true,
            message: "lecture marked as completed",
            data: courseProgress
        });



    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
}