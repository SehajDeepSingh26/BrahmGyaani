import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { markLectureAsComplete } from '../../../services/operations/courseDetailAPI';
import { updateCompletedLectures } from '../../../slice/viewCourseSlice';

import 'video-react/dist/video-react.css'; // import css
import { ControlBar, PlaybackRateMenuButton, Player } from 'video-react';
import { AiFillPlayCircle } from 'react-icons/ai';
import IconBtn from '../../Common/IconBtn';

const VideoDetails = () => {
    const { courseId, sectionId, subSectionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const playerRef = useRef();
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null

    useEffect(() => {
        const checkValidUser = async() => {
            const stuList = courseEntireData?.studentsEnrolled;
            var validUser = false
            stuList.map((student) => {
                if(user?._id == student)
                    validUser = true;
            })
            if(!validUser)
                navigate("/error")
        }
        checkValidUser();
    }, [user])

    const { token } = useSelector((state) => state.auth);
    const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse);

    const [videoData, setVideoData] = useState([]);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const setVideoSpecificDetails = async () => {
            if (!courseSectionData) return;
            if (!courseId || !sectionId || !subSectionId)
                navigate("/dashboard/enrolled-courses");
            else {
                const filteredData = courseSectionData?.filter(
                    (course => course._id === sectionId));
                const filteredVideoData = filteredData?.[0]?.subSection?.filter((data) => data._id === subSectionId);

                setVideoData(filteredVideoData[0]);
                setVideoEnded(false);
            }
        }
        setVideoSpecificDetails();
    }, [courseSectionData, courseEntireData, location.pathname]);

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        );

        if (currentSectionIndex == 0 && currentSubSectionIndex == 0)
            return true;

        return false;
    };

    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        );

        if (currentSectionIndex === courseSectionData.length - 1 && currentSubSectionIndex === noOfSubSections - 1)
            return true;

        return false;
    };

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        );

        if (currentSubSectionIndex !== noOfSubSections - 1) {   //^ current section next video
            const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id;

            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
        }
        else {   //^ next section 1st video
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;

            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
        }
    };

    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        );

        if (currentSubSectionIndex !== 0) {   //^ current section prev video
            const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id;

            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
        }

        else {   //^ prev section last video
            const prevNoOfSubSection = courseSectionData[currentSectionIndex - 1].subSection.length;

            const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
            console.log(courseSectionData[currentSectionIndex - 1]);
            const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prevNoOfSubSection - 1]._id;

            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
        }
    };

    const handleLectureCompletion = async () => {

        setLoading(true);

        const res = await markLectureAsComplete({
            courseId,
            subSectionId
        }, token);

        //^ update state
        if (res) {
            console.log("DONE------------", completedLectures)
            dispatch(updateCompletedLectures(subSectionId));
        }

        setLoading(false);
    };

    return (
        <div className='mt-10 text-white'>
            {/* {console.log(courseEntireData)} */}
            {
                !videoData ? (
                    <div>No data found</div>
                ) : (
                    <div className='relative'>
                        <Player
                            ref={playerRef}
                            aspectRatio='16:9'
                            playsInline
                            onEnded={() => setVideoEnded(true)}
                            src={videoData?.videoUrl}
                        >
                            
                            <AiFillPlayCircle />
                        </Player>

                        {
                            videoEnded && (
                                <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 space-y-4">
                                    {/* Mark as Completed Button */}
                                    {
                                        !completedLectures.includes(subSectionId) && (
                                            <IconBtn
                                                disabled={loading}
                                                onclick={() => handleLectureCompletion()}
                                                text={!loading ? "Mark as completed" : "Loading"}
                                                className="bg-yellow-500 text-richblack-900 px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300"
                                            />
                                        )
                                    }
                                    {/* Rewatch Button */}
                                    <IconBtn
                                        disabled={loading}
                                        onclick={() => {
                                            if (playerRef?.current) {
                                                playerRef.current?.seek(0);
                                                setVideoEnded(false);
                                            }
                                        }}
                                        text="Rewatch"
                                        className="bg-yellow-500 text-richblack-900 px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300"
                                    />

                                    {/* Prev-Next Buttons */}
                                    <div className='flex gap-4'>
                                        {!isFirstVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={goToPrevVideo}
                                                className='bg-richblack-700 text-white px-4 py-2 rounded-lg hover:bg-richblack-800 transition-all duration-300'
                                            >
                                                Prev
                                            </button>
                                        )}
                                        {!isLastVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={goToNextVideo}
                                                className='bg-yellow-300 text-richblack-900 px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300'
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        }

                        <div className="mt-10">
                            <h1 className='text-2xl font-bold'>
                                Title: {videoData?.title}
                            </h1>
                            <h2 className='text-lg mt-2'>
                                Description: {videoData?.description}
                            </h2>
                        </div>
                    </div>
                )
            }
        </div>
    );

}

export default VideoDetails;
