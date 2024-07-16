import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailAPI'
import IconBtn from '../../Common/IconBtn'
import Coursetable from './InstructorCourses/Coursetable'

const MyCourses = () => {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])

    useEffect(() => {
        const fetchCourses = async () => {
            const result = await fetchInstructorCourses(token)
            if (result) {
                setCourses(result)
            }
        }
        fetchCourses()
    }, [token])

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-richblack-5">My Courses</h1>
                <IconBtn
                    text="Add Course"
                    onclick={() => navigate("/dashboard/add-course")}
                    // Add your icon here if any
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                />
            </div>

            {courses && <Coursetable courses={courses} setCourses={setCourses} />}
        </div>
    )
}

export default MyCourses
