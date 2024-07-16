import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import IconBtn from '../../../../Common/IconBtn';
import { SiSimpleanalytics } from 'react-icons/si';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { resetCourseState } from '../../../../../slice/courseSlice';
import { useNavigate } from 'react-router-dom';
import { editCourseDetails } from '../../../../../services/operations/courseDetailAPI';

const PublishCourse = () => {
    const { register, handleSubmit, setValue, getValues } = useForm();
    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(course?.status === COURSE_STATUS.PUBLISHED){
            setValue("public", true)
        }
    }, [])

    const onSubmit = () => {
        handleCoursePublish();
    }
    const goBack = () => {
        dispatch(setStep(2))
    }
    const handleCoursePublish = async() => {
        if(course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === false || course?.status === COURSE_STATUS.DRAFT && getValues("public") === false){        //^ form is not updated, thus no api call
            goToCourses();
            return;
        }
        else{
            const formData = new FormData();
            formData.append("courseId", course._id)
            const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT
            formData.append("status", courseStatus)

            setLoading(true);
            const result = await editCourseDetails(formData, token)

            if(result) {
                goToCourses();
            }
        }
    }

    const goToCourses = () => {
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses")
    }

    return (
        <div className='bg-richblack-700 rounded-md border-[1px] text-white'>
            <h1 className='mt-3 text-lg p-5'>Publish Course</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='pl-5'>
                <div className='flex gap-4'>
                    <label htmlFor="">
                        <input type="checkbox"
                                id='pubblic'
                                {...register("public")}
                                className='bg-white'
                            />
                        <span className='ml-3'>: Make this course as Public  </span>
                    </label>


                </div>

                <div className='flex justify-end gap-5 p-5'>
                    <button
                        disabled={loading}
                        type='button'
                        onClick={goBack}
                        className='flex items-center rounded-md'
                        
                    >
                        <IconBtn disabled={loading} text={"Go Back"} />

                    </button>
                    <button 
                        disabled={loading}
                        type='submit'
                        className='flex items-center rounded-md'
                    >
                        <IconBtn disabled={loading} text={"Save changes"} />

                    </button>
                </div>
            </form>
        </div>
    )
}

export default PublishCourse
