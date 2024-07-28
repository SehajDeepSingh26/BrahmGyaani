import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailAPI';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Pagination, Navigation } from 'swiper/modules';
import InstructorChart from './InstructorChart';

const Instructor = () => {
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();

    useEffect(() => {
        const getCourseDataStats = async () => {
            setLoading(true);
            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);

            if (instructorApiData.length) setInstructorData(instructorApiData);

            if (result) setCourses(result);

            setLoading(false);
        };
        getCourseDataStats();
    }, [token]);

    let totalStudents = 0;
    let totalAmount = 0;

    instructorData?.forEach((course) => {
        totalStudents += course.totalStudentsEnrolled;
        totalAmount += course.totalAmountGenerated;
    });

    return (
        <div className="text-white p-4 flex flex-col lg:flex-row">
            <div className="lg:w-2/3">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Hi {user?.firstName}</h1>
                    <p className="text-lg mt-2">Let&apos;s start something new</p>
                </div>

                {loading ? (
                    <div className="spinner mx-auto"></div>
                ) : courses.length > 0 ? (
                    <div>
                        <div className='flex gap-5'>
                            <div className="mb-8 min-w-[700px]">
                                <InstructorChart courses={instructorData} />
                            </div>

                            {/* //^ Statistics Section */}
                            <div className="min-w-[200px] lg:pt-0 pt-8 ">
                                <div className=" p-6 rounded-lg shadow-md bg-richblack-800">
                                    <p className="text-2xl font-semibold mb-4">Statistics</p>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-gray-900 rounded-lg">
                                            <p className="text-md">Total Courses</p>
                                            <p className="text-lg font-bold">-{`>`} {courses.length}</p>
                                        </div>
                                        <div className="bg-gray-900 rounded-lg">
                                            <p className="text-md">Total Students</p>
                                            <p className="text-lg font-bold">-{`>`} {totalStudents}</p>
                                        </div>
                                        <div className="bg-gray-900 rounded-lg">
                                            <p className="text-md">Total Income</p>
                                            <p className="text-lg font-bold">-{`>`} Rs {totalAmount}/-</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className="mb-8 min-w-[920px]">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-2xl font-semibold">Your Courses</p>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                    onClick={() => navigate('/dashboard/my-courses')}
                                >
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
                                    className="w-full"
                                >
                                    {courses?.map((course, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                                                <img
                                                    src={course.thumbnail}
                                                    alt="course-image"
                                                    className="w-full h-48 object-cover rounded-md mb-4"
                                                />
                                                <p className="text-xl font-semibold">{course?.courseName}</p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <p>{course?.studentsEnrolled.length} students</p>
                                                    <p>Rs {course.price}</p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center mt-8">
                        <p className="text-xl">You have not created any Course</p>
                        <button
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                            onClick={() => navigate('/dashboard/add-course')}
                        >
                            Create Course
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Instructor;
