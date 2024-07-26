import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailAPI';
import { updateCompletedLectures } from '../../../slice/viewCourseSlice';

import 'video-react/dist/video-react.css'; // import css
import { Player } from 'video-react';
import { AiFillPlayCircle } from 'react-icons/ai';
import IconBtn from '../../Common/IconBtn';

const VideoDetails = () => {

    const {courseId, sectionId, subSectionId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location =  useLocation();
    const playerRef = useRef();

    const {token} = useSelector((state) => state.auth)
    const {courseSectionData, courseEntireData, completedLectures} = useSelector((state) => state.viewCourse)

    const [videoData, setVideoData] = useState([])
    const [videoEnded, setVideoEnded] = useState(false)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const setVideoSpecificDetails = async() => {
            if(!courseSectionData) return
            if(!courseId || !sectionId || !subSectionId)
                navigate("/dashboard/enrolled-courses")
            else{
                const filteredData = courseSectionData.filter(
                    (course => course._id === sectionId))  
                const filteredVideoData = filteredData?.[0].subSection.filter((data) => data._id === subSectionId)  
                
                setVideoData(filteredVideoData[0])
                setVideoEnded(false)
            }
        }
        setVideoSpecificDetails();
    }, [courseSectionData, courseEntireData, location.pathname])

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        )

        if(currentSectionIndex == 0 && currentSubSectionIndex == 0)
            return true;

        return false
    }
    
    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        )

        if(currentSectionIndex === courseSectionData.length - 1 && currentSubSectionIndex === noOfSubSections-1) 
            return true;

        return false;
    }

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        )

        if(currentSubSectionIndex !== noOfSubSections-1){   //^ current section next video
            const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex+1]._id

            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        }
        else{   //^ next section 1st video
            const nextSectionId = courseSectionData[currentSectionIndex+1]._id;
            const nextSubSectionId = courseSectionData[currentSectionIndex+1].subSection[0]._id

            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
    }

    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )

        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
            (data) => data._id === subSectionId
        )

        if(currentSubSectionIndex !== 0){   //^ current section prev video
            const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1]._id

            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
        }

        else{   //^ prev section last video
            const prevNoOfSubSection = courseSectionData[currentSectionIndex-1].subSection.length;
            
            const prevSectionId = courseSectionData[currentSectionIndex-1]._id;
            console.log(courseSectionData[currentSectionIndex-1])
            const prevSubSectionId = courseSectionData[currentSectionIndex-1].subSection[prevNoOfSubSection-1]._id

            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
        }
    }

    const handleLectureCompletion = async() => {

        //TODO : CHANGE controller code

        setLoading(true)

        const res = await markLectureAsComplete({
            courseId,
            subSectionId
        }, token)

        //^ update state
        if(res){
            dispatch(updateCompletedLectures(subSectionId))
        }
    }

    return (
        <div className='mt-20 text-white'>
            {
                !videoData ? (
                    <div>No data found</div>
                ) : (
                    <Player 
                        ref = {playerRef}
                        aspectRatio='16:9'
                        playsInline
                        onEnded={() => setVideoEnded(true)}
                        src={videoData?.videoUrl}
                    >
                        <AiFillPlayCircle />  

                        {
                            videoEnded && (
                                <div>
                                    {/* //^ MarkAsComplted Btn */}
                                    {
                                        !completedLectures.includes(subSectionId) && (
                                            <IconBtn
                                                disabled={loading}
                                                onclick={() => handleLectureCompletion()}
                                                text={!loading ? "Mark as completed" : "Loading"}
                                            />
                                        )
                                    }
                                    {/* //^ Rewatch Btn */}
                                    <IconBtn
                                        disabled={loading}
                                        onclick={() => {
                                            if(playerRef?.current){
                                                playerRef.current?.seek(0);
                                                setVideoEnded(false)
                                            }
                                        }}
                                        text="Rewatch"
                                    />

                                    {/* //^ Prev-Next Btn */}
                                    <div className='flex gap-10 p-3'>
                                        {!isFirstVideo() && (
                                            <button 
                                                disabled={loading}
                                                onClick={goToPrevVideo}
                                                className='w-3 text-lg'
                                            >
                                                Prev
                                            </button>
                                        )}
                                        {!isLastVideo() && (
                                            <button 
                                                disabled={loading}
                                                onClick={goToNextVideo}
                                                className='blackButton w-3 h-9 text-lg '
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    </Player>
                )
            }

            <h1 className='mt-20 text-2xl'>
                Title: {videoData?.title}
            </h1>
            <h2 className='text-lg'>
                Description: {videoData?.description}
            </h2>
            
        </div>
    )
}

export default VideoDetails
