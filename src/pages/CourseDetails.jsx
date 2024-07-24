import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from "../services/operations/StudentFeaturesAPI";
import { fetchCourseDetails } from '../services/operations/courseDetailAPI';
import GetAvgRating from '../utils/avgRating';
import Error from "../pages/Error"
import ConfirmationModal from '../components/Common/ConfirmationModal';
import { RatingStars } from '../components/Common/RatingStars';
import { formatDate } from '../utils/dateFormatter';
import { FaGlobe } from 'react-icons/fa';
import CourseCardDetails from '../components/Core/Course/CourseCardDetails';


const CourseDetails = () => {

    const { user } = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { loading } = useSelector((state) => state.profile)
    const { paymentLoading } = useSelector((state) => state.course)
    const [confirmationModal, setConfirmationModal] = useState(null)

    const [courseData, setCourseData] = useState(null)

    useEffect(() => {
        const getCourseFullDetails = async () => {
            try {
                const result = await fetchCourseDetails(courseId);
                setCourseData(result)
            } catch (error) {
                console.log("Could noyt fetch course Data")
            }
        }
        getCourseFullDetails()
    }, [courseId])

    const [avgReviewCount, setAvgReviewCount] = useState(0);
    useEffect(() => {
        const count = GetAvgRating(courseData?.data?.courseDetail?.ratingAndReviews);
        setAvgReviewCount(count)
    }, [courseData])

    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
    useEffect(() => {
        let lectures = 0;
        courseData?.data?.courseDetail?.courseContent?.forEach((sec) => {
            lectures = sec.subSection.length || 0
        })
        setTotalNoOfLectures(lectures)
    }, [courseData])



    const handleBuyCourse = () => {
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
        })
    }


    if (loading || !courseData) {
        return (
            <div className='text-white'>Loading...</div>
        )
    }

    if (!courseData.success) {
        return (
            <div>
                <Error />
            </div>
        )
    }
    console.log("COURSEDATA----------", courseData)

    const {
        // _id: course_id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
        // eslint-disable-next-line no-unsafe-optional-chaining
    } = courseData.data?.courseDetail;



    return (
        <div className='flex text-richblack-5 mt-20 '>

            <div className='relative flex flex-col justify-start p-8 bg-richblack-200'>
                <p>{courseName} </p>
                <p>{courseDescription} </p>
                <div className='flex flex-row gap-x-2'>
                    <span>{avgReviewCount}</span>
                    <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                    <span>{`(${ratingAndReviews.length} reviews) `} </span>
                    <span>{`(${studentsEnrolled.length} Students Enrolled)`} </span>
                </div>

                <div>
                    <p>Created By {`${instructor.firstName} ${instructor.lastName}`} </p>
                </div>

                <div className='flex gap-x-3'>
                    <p>
                        Created at {formatDate(createdAt)}
                    </p>
                    <FaGlobe className='translate-y-1' />
                    <p>English</p>
                </div>

                    </div>
                <div>
                    <CourseCardDetails
                        course={courseData?.data.courseDetail}
                        setConfirmationModal={setConfirmationModal}
                        handleBuyCourse={handleBuyCourse}
                    />

                </div>




            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    )
}

export default CourseDetails
