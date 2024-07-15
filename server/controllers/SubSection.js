const SubSection = require('../models/SubSection.model');
const Section = require('../models/Section.model');
const {uploadImageToCloudinary} = require("../utils/imageUploader")

exports.createSubSection = async(req, res) => {
    try {
        /* 
        ^   STEPS
        ^   1. Fetch data
        ^   2. Fetch files/video
        ^   3. validaion
        ^   4. upload video to cloudinary
        ^   5. create subsection
        ^   6. update section with new SubSectionId
        ^   7. return response
        */

        const {sectionId, title, description} = req.body;
        const video = req.files.video;

        if(!sectionId || !title || !description || !video ) { 
            return res.status(400).json({
                success: false,
                message: " All fields are required",
            })
        }

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)

        const newSubSection = await SubSection.create({
            title: title, 
            description: description,
            timeDuration: `${uploadDetails.furation}`,
            videoUrl: uploadDetails.secure_url
        })

        const subSectionDetail = await Section.findByIdAndUpdate(
                                    {_id:sectionId},
                                    {$push: {
                                        subSection: newSubSection._id
                                    }},
                                    {new: true}
                                )
                                .populate("subSection")                                    
        if(!subSectionDetail)
            return res.status(403).json({
                success: false,
                message: "No Section found"
            })
        // TODO: log updated section here after using populated here

        return res.status(200).json({
            success: true,
            message: " SubSection added successfully",
            data: subSectionDetail
        })
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            success: false,
            message: "Error occured while adding SubSection",
            error: error.message
        })
    }
}

exports.updateSubSection = async(req, res) => {
    try {
        //^ 1. get data
        //^ 2. validate
        //^ 3. validate subSection existence
        //^ 4. update subSection's thumbnail, name, title, desc, etc
        //^ 5. return res
    
        const {title, description, sectionId, subSectionId} = req.body;
        
        let newSubSection = await SubSection.findById(subSectionId);
        if(!newSubSection)
            return res.status(400).json({
                success: false,
                message: "SubSection not found"})
        
        if(title !== undefined)
            newSubSection.title = title
        if(description !== undefined)
            newSubSection.description = description

        if (req.files && req.files.video !== undefined ) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            );
            newSubSection.videoUrl = uploadDetails.secure_url
            newSubSection.timeDuration = `${uploadDetails.duration}`
        }

        await newSubSection.save();

        const updatedSection = await Section.findByIdAndUpdate(sectionId)
                                .populate("subSection")
                                .exec();
    
        return res.status(200).json({
            success: true,
            message: " SubSection updated successfully",
            data: updatedSection
        })
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            success: false,
            message: "Error occured while updating SubSection",
            error: error.message
        })
    }
}

exports.deleteSubSection = async(req, res) => {
    try {
        const {subSectionId, sectionId} = req.body
        if(!subSectionId)
            return res.status(400).json({
                success: false,
                message: "subSection Id is required"})
    
        //delete from section
        await Section.findOneAndUpdate(
                {_id: sectionId},
                {
                    $pull:{
                        subSection: subSectionId
                    }
                },
        )
    
        //delete subSection
        const subSection = await SubSection.findByIdAndDelete({_id: subSectionId})
        if(!subSection){
            return res.status(404).json({
                success: false, 
                message: "SubSection not found"
            })
        }

        const updatedSection = await Section.findById(sectionId).populate("subSection")
    
        return res.status(200).json({
            success: true,
            message: "Section deleted Successfully",
            data: updatedSection
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message,
        });
    }

}
    