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

        const {sectionId, title, timeDuration, description} = req.body;
        const video = req.files.videoFile;

        if(!sectionId || !title || !timeDuration || !description || !video ) { 
            return res.status(400).json({
                success: false,
                message: " All fields are required",
            })
        }

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)

        const newSubSection = await SubSection.create({
            title: title, 
            timeDuration: timeDuration,
            description: description,
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
            UpdatedSection: subSectionDetail
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
    
        const {title, description, timeDuration} = req.body;
        const {subSectionId} = req.body
        const video = req.files.videoFile
    
        if(!title || !description || !timeDuration)
            return res.status(400).json({
                success: false,
                message: "Alll fields required"})
        
        const newSubSection = await SubSection.findById(subSectionId);
        if(!newSubSection)
            return res.status(400).json({
                success: false,
                message: "SubSection not found"})

        if (video) {
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            );
            newSubSection = {
                ...newSubSection,
                VideoUrl: uploadDetails.secure_url,
            };
        }

        const newSubSectionDetail = await SubSection.findByIdAndUpdate(subSectionId, 
                    {description: description, timeDuration: timeDuration, title: title},
                    {new: true}
        );
    
        return res.status(200).json({
            success: true,
            message: " SubSection updated successfully",
            newSubSectionDetail
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

exports.deleteSubSection = async(req, res) => {
    try {
        const {subSectionId} = req.body
        if(!subSectionId)
            return res.status(400).json({
                success: false,
                message: "subSection Id is required"})
    
        //delete from section
        const updatedSection = await Section.findOneAndUpdate(
                {subSection: subSectionId},
                {
                    $pull:{
                        subSection: subSectionId
                    }
                },
                {new: true}
        )
    
        //delete subSection
        await SubSection.findByIdAndDelete({_id: subSectionId})
    
        return res.status(200).json({
            success: true,
            message: "Section deleted Successfully",
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
    