const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async(file, folder, height, quality) => {
    try {
        const options = {folder};
        if(height){
            options.height = height;
        }
        if(quality){
            options.quality = quality;
        }

        options.resource_type = "auto"; 

        return await cloudinary.uploader.upload(file.tempFilePath, options)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error occured during file uploading to cloudinary"
        })
    }
}