import React, { useEffect, useState } from 'react';
import { BsBack } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../Common/IconBtn';

const VideoDetailsSidebar = ({ setReviewModal }) => {
    const [activeStatus, setActiveStatus] = useState("");
    const [videobarActive, setVideobarActive] = useState("");
    const { sectionId, subSectionId } = useParams();
    const navigate = useNavigate();

    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures
    } = useSelector((state) => state.viewCourse);
    const location = useLocation();

    useEffect(() => {
        const handleActiveStatus = () => {
            if (!courseSectionData.length) return;

            const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);   //^ for highlighting active section
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
                (data) => data._id === subSectionId
            );
            const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;

            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
            setVideobarActive(activeSubSectionId);
        };

        handleActiveStatus();
    }, [courseSectionData, courseEntireData, location.pathname]);

    return (
        <div className='mt-10 text-white w-1/4'>
            <div className='bg-richblack-900 p-5 rounded-lg shadow-md'>
                {/* for btns and headings */}
                <div className="flex justify-between items-center mb-4">
                    {/* for btns */}
                    <div className="flex items-center cursor-pointer text-richblack-5"
                        onClick={() => {
                            navigate("/dashboard/enrolled-courses")
                        }}>
                        <BsBack className="mr-2" />
                        <span>Back</span>
                    </div>

                    <div>
                        <IconBtn
                            text={"Add review"}
                            onclick={() => setReviewModal(true)} />
                    </div>
                </div>

                {/* for heading or title */}
                <div className="mb-4">
                    <p className="text-xl font-bold">{courseEntireData?.courseName}</p>
                    <p className="text-sm">{completedLectures?.length} / {totalNoOfLectures} </p>
                </div>

                {/* For sections and subsections */}
                <div>
                    {courseSectionData?.map((course, index) => (
                        <div
                            onClick={() => setActiveStatus(course?._id)}
                            key={index}
                            className={`mb-2 p-2 rounded-lg cursor-pointer ${activeStatus === course?._id ? 'bg-richblack-700' : 'bg-richblack-800'}`}
                        >
                            {/* //^ Section */}
                            <div className="flex justify-between items-center">
                                <div>
                                    {course?.sectionName}
                                </div>
                                {/* //^ arrow ddaldo and handle rotate logic */}
                            </div>

                            {/* //^ SubSection */}
                            <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${activeStatus === course?._id ? 'max-h-screen' : 'max-h-0'}`}>
                                {activeStatus === course?._id && (
                                    <div className='mt-2'>
                                        {
                                            course.subSection.map((topic, index) => (
                                                <div key={index} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${videobarActive === topic._id ? "bg-yellow-50 text-richblack-900" : "bg-richblack-900 text-white"}`}
                                                    onClick={() => {
                                                        navigate(`/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`)
                                                        setVideobarActive(topic?._id)
                                                    }}
                                                >
                                                    <input
                                                        type='checkbox'
                                                        checked={completedLectures.includes(topic._id)}
                                                    />
                                                    <p>{topic.title}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default VideoDetailsSidebar;
