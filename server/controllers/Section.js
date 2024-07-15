const Section = require('../models/Section.model')
const Course = require('../models/Course.model');
const SubSection = require('../../compare/StudyNotion11/server/models/SubSection');

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

exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId,courseId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

		res.status(200).json({
			success: true,
			message: section,
			data:course,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// DELETE a section
exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		// await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});

	} catch (error) {
		console.error( error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
            error: error
		});
	}
};   