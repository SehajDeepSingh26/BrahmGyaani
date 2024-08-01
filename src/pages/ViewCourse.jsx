import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slice/viewCourseSlice';
import VideoDetailsSidebar from '../components/Core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/Core/ViewCourse/CourseReviewModal';

const ViewCourse = () => {
    const [reviewModal, setReviewModal] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { courseId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const setCourseSpecificDetails = async () => {
            const courseData = await getFullDetailsOfCourse(courseId, token);
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
            dispatch(setEntireCourseData(courseData.courseDetails));
            dispatch(setCompletedLectures(courseData.completedVideos));

            let lectures = 0;
            courseData.courseDetails?.courseContent?.forEach((sec) => {
                lectures += sec.subSection.length;
            });
            dispatch(setTotalNoOfLectures(lectures));
        };
        setCourseSpecificDetails();
    }, []);

    return (
        <div className=" min-h-screen text-richblack-5">
            <div className="flex gap-20 p-10">
                <VideoDetailsSidebar setReviewModal={setReviewModal} />
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
            {reviewModal && (<CourseReviewModal setReviewModal={setReviewModal} />)}
            {/* {console.log("REVIEW MODAALLLL_------------------",reviewModal)} */}
        </div>
    );
};

export default ViewCourse;
