const Section = require('../models/Section')
const Course = require('../models/Course')

exports.createSection = async(req, res) => {
   try {
     const {sectionName, courseId} = req.body;
     if(!sectionName || !courseId)
        return res.status(403).json({
            success: false,
            message: "Enter all fields"
        })
 
     const newSection = await Section.create({
         sectionName: sectionName
     })

     //^ Update Course to add Section there
     const UpdatedCourse = await Course.findByIdAndUpdate(courseId, 
            {
                $push:{
                    courseContent: newSection._id
                }
            }, 
            {new: true})        // ^ use populate to replace sections and subSections both in the updatedCourseDetails
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                },
            })  
            .exec()
        

        return res.status(200).json({
            success: true,
            message: "New Section added successfully",
            UpdatedCourse
        })

   } catch (error) {
        console.log(error);
        return res.status(403).json({
            success: false,
            message: "Error occured while aadding Section",
            error: error.message
        })
    
   }
}

exports.updateSection = async(req, res) => {
    try {
        console.log(req.data)
        const {sectionName, sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(403).json({
                success: false,
                message: "Enter all fields"
            })
        }

        const updateContentSection = await Section.findByIdAndUpdate(
                        sectionId, 
                        {sectionName: sectionName}, 
                        {new: true})
        
        return res.status(200).json({
            success: true,
            message: " Section updated successfully",
            updateContentSection
        })

    } catch (error) {
        console.log(error);
        return res.status(403).json({
            success: false,
            message: "Error occured while updating Section",
            error: error.message
        })
    }
}

exports.deleteSection = async(req, res) => {
    try {
        const {sectionId} = req.body      //^ assuming we get id from url
    
        await Section.findByIdAndDelete(sectionId)

        const course = await Course.findOne({courseContent: sectionId})
        // if(!courseId)
        //     return res.status(403).json({
        //         success: false,
        //         message: "No course Found ",
        //     })

        //^ deleting sectionId from course
        if(course){
            course.courseContent.pull(sectionId)
            await course.save()
        }
    
        return res.status(200).json({
            success: true,
            message: " Section deleted successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            success: false,
            message: "Error occured while deleting Section",
            error: error.message
        })
    }

    /*
        try {
        // get id  assuming that we are sending id in params
        const { sectionId } = req.body;
        console.log(sectionId);
        // ek course me se id delete karni hai 
        const course = await Course.findOne({ courseContent: sectionId });

        if (course) {
            // Remove the section reference from the course
            course.courseContent.pull(sectionId);
            await course.save();
        }


        // ek subsection related to that section delete karna hai 4
        const section = await Section.findById(sectionId);

        if (!section) {
            return res.status(400).json({
                success: false,
                message: "Section not found"
            })
        }
        await subSection.deleteMany({ _id: { $in: section.subSection } });


        // than finally section delete karna hai 
        await Section.findByIdAndDelete(sectionId);
        //TODO - donwe need to delete the entry from the course schema
        return res.status(200).json({
            success: true,
            message: "Section deleted Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete the section plesase try again",
            error: error.message
        })
    }
    */

}