/* eslint-disable no-undef */
const Profile = require("../models/Profile.model");
const User = require("../models/User.model");
const {uploadImageToCloudinary} = require("../utils/imageUploader")

exports.updateProfile = async(req, res) => {
    try {
        /*
        ^   1. get data
        ^   2. get userId
        ^   3. validation
        ^   4. find profile
        ^   5. update profile
        ^   6. retun res
        */

        const {dateOfBirth="", about="", contactNumber, gender, firstName, lastName} = req.body
        const userId = req.user.id   

        if(!userId) {
            return res.status(403).json({
                success: false,
                message: "Please logIn"
            })
        }

        const userDetail = await User.findById(userId)
        const profileId = userDetail.additionalDetails;

        const profileDetails = await Profile.findById(profileId)

        userDetail.firstName = firstName
        userDetail.lastName = lastName
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.gender = gender
        profileDetails.about = about
        profileDetails.contactNumber = contactNumber

        await profileDetails.save()
        userDetail.save()

        return res.status(200).json({
            success: true,
            message: "Profile updated",
            profileDetails
        })

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message: "Error occured during Profile updation"
        })
    }
}

//TODO schedule delete operation

exports.deleteAccount = async(req, res) => {
    try {
        //^ delete profile
        //^ delete user

        const id = req.user.id
        const userDetails = await User.findById(id)
        if(!userDetails)
            return res.status(401).json({
                success:false,
                message: "User not found"
            })
        
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        
        //TODO reduce count of userEnroller
        //^ what is cron job?

        await User.findByIdAndDelete({_id:id})

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",            
          })
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message: "Error occured during Deletin Profile"
        })
    }
}

exports.getAllUserDetails = async(req, res) => {
    try {
        const id = req.user.id
        const userDetails = await User.findById({_id: id})
                    .populate("additionalDetails")
                    .exec()

        if(!userDetails)
            return res.status(401).json({
                success:false,
                message: "User not found"
            })
        
        return res.status(200).json({
            success: true,
            message: "Deatils of user fetched",
            userDetails
        })

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            success:false,
            message: "Error occured during Deletin Profile"
        })
    }
}


exports.updateDisplayPicture = async (req, res) => {
    try {
        
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        const userDetails = await User.findOne({
          _id: userId,
        })
          .populate("courses")
          .exec()
        if (!userDetails) {
          return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
          })
        }
        return res.status(200).json({
          success: true,
          data: userDetails.courses,
        })
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }
};