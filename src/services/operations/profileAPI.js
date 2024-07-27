import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis";

export const getUserEnrolledCourses = async(token) => {
    const toastId = toast.loading("Loading...")
    let result = [];

    const {
        GET_USER_ENROLLED_COURSES_API,
    } = profileEndpoints

    try {
        // console.log(token)
        const response = await apiConnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorisation: `Bearer ${token}`
            }
        )

        console.log("RESPONSE_GET_USER_ENROLLED_COURSES.......", response)

        if(!response.data.success){
            throw new Error(response.data.message)
        }
        result = response.data.data

    } catch (error) {
        console.log("GET_USER_ENROLLED_COURSES_API ERROR.........", error)
        toast.error("Could not get enrolled courses")

    }

    toast.dismiss(toastId)
    return result
}

export const getInstructorData = async(token) => {
    const toastId = toast.loading("Loading...")

    let result = []

    try {
        const response = await apiConnector(
            "GET",
            profileEndpoints.GET_INSTRUCTOR_DATA_API, 
            null, 
            {
                Authorisation: `Bearer ${token}`
            }
        )

        console.log("GET_INSTRUCTOR_API", response)
        result = response?.data?.courses

    } catch (error) {
        console.log("GET_INSTRUCTOR_API_ERROR", error)
        toast.error("Could not get Instructor courses")
    }

    toast.dismiss(toastId)
    return result;
}