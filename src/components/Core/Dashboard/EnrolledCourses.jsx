import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ProgressBar from "@ramonak/react-progress-bar";
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = () => {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const [enrolledCourses, setEnrolledCourses] = useState(null)

    const getEnrolledCourses = async () => {
        try {
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response)
        } catch (error) {
            console.log("Unable to fetch enrolled courses", error)
        }
    }
    useEffect(() => {
        getEnrolledCourses();
    }, [])

    return (
        <div className="bg-richblack-800 text-richblack-5 min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">Enrolled Courses</h1>
            {
                !enrolledCourses ? (
                    <div>Loading...</div>
                ) : enrolledCourses.length === 0 ? (
                    <p className="text-lg">You have not enrolled in any course yet</p>
                ) : (
                    <div>
                        <div className="grid grid-cols-3 gap-4 mb-4 font-bold">
                            <p>Course Name</p>
                            <p>Duration</p>
                            <p>Progress</p>
                        </div>
                        {
                            enrolledCourses.map((course, i, arr) => (
                                <div key={i} className={`grid grid-cols-3 gap-4 items-center bg-richblack-700 p-4 mb-4 rounded-lg ${i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"}`}>
                                    <div 
                                        className="flex items-center gap-4"
                                        onClick={() => {
                                            navigate(
                                              `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                            )
                                          }}    
                                    >
                                        <img src={course.thumbnail} alt={course.courseName} className="w-16 h-16 rounded-lg object-cover" />
                                        <div>
                                            <p className="text-lg font-semibold">{course.courseName}</p>
                                            <p className="text-sm text-richblack-200">{course.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        {course?.totalDuration}
                                    </div>
                                    <div className="text-center">
                                        <p>Progress: {course?.progressPercentage || 0}%</p>
                                        <ProgressBar
                                            completed={course.progressPercentage || 0}
                                            height='8px'
                                            isLabelVisible={false}
                                        />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}

export default EnrolledCourses
