import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailAPI'
import { getInstructorData } from '../../../../services/operations/profileAPI'
import { Link, useNavigate } from 'react-router-dom'

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay, FreeMode, Pagination, Navigation } from 'swiper/modules';
import InstructorChart from './InstructorChart'

const Instructor = () => {

    const { token } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [instructorData, setInstructorData] = useState(null)
    const [courses, setCourses] = useState([])
    const { user } = useSelector((state) => state.profile)

    const navigate = useNavigate();


    useEffect(() => {
        const getCourseDataStats = async () => {
            setLoading(true);
            const instructorApiData = await getInstructorData(token)
            const result = await fetchInstructorCourses(token);

            if (instructorApiData.length)
                setInstructorData(instructorApiData)

            // console.log(instructorApiData)
            // console.log(result)

            if (result)
                setCourses(result)

            setLoading(false)
        }
        getCourseDataStats();
    }, [])


    let totalStudents = 0;
    let totalAmount = 0;

    instructorData?.map((course) => {
        totalStudents += course.totalStudentsEnrolled
        totalAmount += course.totalAmountGenerated
    })

    // console.log("--------", totalStudents, totalAmount)


    return (
        <div className='text-white '>
            <div>
                <h1>
                    Hi {user?.firstName}
                </h1>
                <p>Lets start something new</p>
            </div>

            {loading ? (<div className='spinner'></div>)
                : courses.length > 0 ? (
                    <div>
                        <div>
                            <div>
                                <InstructorChart courses={instructorData} />
                                <div>
                                    <p>Statistics</p>
                                    <div>
                                        <p>Total Courses</p>
                                        <p>{courses.length}</p>
                                    </div>

                                    <div>
                                        <p>Total Students</p>
                                        <p>{totalStudents}</p>
                                    </div>

                                    <div>
                                        <p>Total Income</p>
                                        <p>{totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            {/* //^ Render courses of instructor here */}
                            <div>
                                <p>Your Courses</p>
                                <button onClick={() => navigate("/dashboard/my-courses")}>
                                    View All
                                </button>
                            </div>

                            <div>
                                <Swiper
                                    slidesPerView={3}
                                    spaceBetween={24}
                                    loop={true}
                                    freeMode={true}
                                    autoplay={{
                                        delay: 2500,
                                        disableOnInteraction: false,
                                    }}
                                    modules={[FreeMode, Pagination, Autoplay]}
                                    className='w-full'
                                >
                                    {
                                        courses?.map((course, index) => (
                                            <SwiperSlide key={index}>
                                                <div>
                                                    <img src={course.thumbnail} alt="course-image" />
                                                </div>
                                                <div>
                                                    <p>{course?.courseName}</p>
                                                    <div className='flex gap-x-3'>
                                                        <p>{course?.studentsEnrolled.length} students</p>
                                                        |
                                                        <p>Rs {course.price}</p>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))
                                    }
                                </Swiper>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        You have not created any Course
                        <button onClick={() => navigate("/dashboard/add-course")}>
                            Create Course
                        </button>
                    </div>
                )}
        </div>
    )
}

export default Instructor
