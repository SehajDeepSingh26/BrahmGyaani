import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from "../services/operations/StudentFeaturesAPI";
import { fetchCourseDetails } from '../services/operations/courseDetailAPI';
import GetAvgRating from '../utils/avgRating';
import Error from "../pages/Error";
import ConfirmationModal from '../components/Common/ConfirmationModal';
import { RatingStars } from '../components/Common/RatingStars';
import { formatDate } from '../utils/dateFormatter';
import { FaGlobe } from 'react-icons/fa';
import CourseCardDetails from '../components/Core/Course/CourseCardDetails';
import Footer from '../components/Common/Footer';
import toast from 'react-hot-toast';

const CourseDetails = () => {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { loading } = useSelector((state) => state.profile);
    const { paymentLoading } = useSelector((state) => state.course);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const [courseData, setCourseData] = useState(null);

    useEffect(() => {
        const getCourseFullDetails = async () => {
            try {
                const result = await fetchCourseDetails(courseId);
                setCourseData(result);
            } catch (error) {
                console.log("Could not fetch course data");
            }
        };
        getCourseFullDetails();
    }, [courseId]);

    const [avgReviewCount, setAvgReviewCount] = useState(0);
    useEffect(() => {
        const count = GetAvgRating(courseData?.data?.courseDetail?.ratingAndReviews);
        setAvgReviewCount(count);
    }, [courseData]);

    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(() => {
        let lectures = 0;

        courseData?.data?.courseDetail?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0;
        });
        setTotalNoOfLectures(lectures);
    }, [courseData]);

    const [isActive, setIsActive] = useState([]);
    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id)
                ? isActive.concat(id)
                : isActive.filter((e) => e != id)
        );
    };

    const handleBuyCourse = () => {
        if (user && user.accountType === "Instructor") {
            toast.error("You are an instructor, you can't buy a course");
            return;
        }
        if (token) {
            buyCourse([courseId], token, user, navigate, dispatch);
            return;
        }
        setConfirmationModal({
            text1: "You are not Logged in",
            text2: "Please login to purchase the course",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null)
        });
    };

    if (loading || !courseData) {
        return (
            <div className='text-white'>Loading...</div>
        );
    }

    if (!courseData.success) {
        return (
            <div>
                <Error />
            </div>
        );
    }

    const {
        courseName,
        courseDescription,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
    // eslint-disable-next-line no-unsafe-optional-chaining
    } = courseData.data?.courseDetail;

    return (
        <div className='text-richblack-5 mt-20 relative'>
            <div className='relative flex flex-col justify-start p-8 bg-richblack-800 rounded-lg shadow-md'>
                <p className='text-3xl font-bold mb-4'>{courseName}</p>
                <p className='text-lg mb-4'>{courseDescription}</p>
                <div className='flex items-center gap-x-2 mb-4'>
                    <span className='text-lg font-semibold'>
                        {avgReviewCount}
                    </span>
                    <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                    <span className='text-sm'>
                        {`(${ratingAndReviews.length} reviews)`}
                    </span>
                    <span className='text-sm'>
                        {`(${studentsEnrolled.length} Students Enrolled)`}
                    </span>
                </div>

                <div className='text-lg mb-4'>
                    <p>Created By {`${instructor.firstName} ${instructor.lastName}`}</p>
                </div>

                <div className='flex items-center gap-x-3 mb-4'>
                    <p className='text-sm'>
                        Created at {formatDate(createdAt)}
                    </p>
                    <FaGlobe />
                    <p className='text-sm'>English</p>
                </div>

                <div className='absolute m-60 mt-96 right-0 transform -translate-y-1/2 bg-richblack-300 p-4 rounded-xl shadow-lg'>
                    <CourseCardDetails
                        course={courseData?.data.courseDetail}
                        setConfirmationModal={setConfirmationModal}
                        handleBuyCourse={handleBuyCourse}
                    />
                </div>
            </div>

            <div className='mt-8'>
                <div className='w-[700px] p-8 rounded-lg shadow-md'>
                    <p className='text-2xl font-bold mb-4'>
                        What You Will Learn
                        </p>
                    <div className='text-lg'>
                        {whatYouWillLearn}
                    </div>
                </div>
            </div>

            <div className='mt-8 p-8 w-[700px] rounded-lg shadow-md'>
                <div className='mb-4'>
                    <p className='text-2xl font-bold'>Course Content</p>
                </div>
                <div className='flex justify-between items-center mb-4 '>
                    <div className='text-lg flex gap-x-2'>
                        <span>{courseContent?.length} section(s)</span>
                        <span>{totalNoOfLectures} lectures</span>
                        <span>{courseData.data.totalDuration} total length</span>
                    </div>
                    {/* <div
                        onClick={() => setIsActive([])}
                    >
                        <button className='bg-blue-500 text-white px-4 py-2 rounded-md'>
                            Collapse all Sections
                        </button>
                    </div> */}
                    
                </div>
            </div>

            <div className='mt-20'>
                <Footer />
            </div>

            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    );
};

export default CourseDetails;
