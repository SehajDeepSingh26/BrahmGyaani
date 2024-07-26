import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { MdOutlineClose } from "react-icons/md";
import { useSelector } from 'react-redux';
import ReactStars from 'react-rating-stars-component';
import IconBtn from '../../Common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailAPI';


const CourseReviewModal = ({ setReviewModal }) => {

    const {user} = useSelector((state) => state.profile)
    const {courseEntiredata} = useSelector((state) => state.viewCourse)
    const {token} = useSelector((state) => state.auth)
    const {setValue, handleSubmit, register, formState: {errors}} = useForm();

    useEffect(() => {
        setValue("courseExperience", "")
        setValue("courseRating", 0) 
    })

    const onSubmit = async (data) => {
        await createRating(
            {
                courseId: courseEntiredata._id,
                rating: data.courseRating,
                review: data.courseExperience
            },
            token
        );
        setReviewModal(false)
    }

    const ratingChanged = (newrating) => {
        setValue("courseRating", newrating)
    }



    return (
        <div>
            <div>
                <div>
                    <p>Add Review</p>
                    <button
                        onClick={setReviewModal(false)}
                    >
                        <MdOutlineClose />
                    </button>
                </div>

                <div>
                    <div>
                        <img
                            src={user?.image}
                            alt='User Image'
                            className='aspect-square rounded-full object-cover w-[50px]'
                        />
                        <div>
                            <p>{user?.firstname} {user?.lastname}</p>
                            <p>Posting Publicly</p>

                        </div>
                    </div>


                    <form onSubmit={handleSubmit(onSubmit)} className='mt-6 flex flex-col items-center'>

                        <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            activeColor="#ffd700"
                        />

                        <div>
                            <label htmlFor="courseExperience">Add your Experience</label>
                            <textarea name="" 
                                id="courseExperience" 
                                placeholder='Add ypur experience'
                                {...register("courseExperience", {required: true})}
                                className='form-style min-h-[130px] w-full'
                            />
                            {
                                errors.courseExperience && (
                                    <span>
                                        Please add your expereince
                                    </span>
                                )
                            }
                        </div>

                        <div>
                            <button onClick={setReviewModal(false)}>
                                Cancel
                            </button>
                            <IconBtn text="save"/>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default CourseReviewModal
