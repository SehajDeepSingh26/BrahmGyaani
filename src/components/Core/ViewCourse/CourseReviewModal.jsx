import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineClose } from "react-icons/md";
import { useSelector } from 'react-redux';
import ReactStars from 'react-stars';
import IconBtn from '../../Common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailAPI';

const CourseReviewModal = ({ setReviewModal }) => {
    const { user } = useSelector((state) => state.profile);
    const { courseEntireData } = useSelector((state) => state.viewCourse);
    const { token } = useSelector((state) => state.auth);
    const { setValue, handleSubmit, register, formState: { errors } } = useForm();

    useEffect(() => {
        setValue("courseExperience", "");
        setValue("courseRating", 0);
    }, [setValue]);

    const onSubmit = async (data) => {
        await createRating({
            courseId: courseEntireData._id,
            rating: data.courseRating,
            review: data.courseExperience
        }, token);
        setReviewModal(false);
    };

    const ratingChanged = (newRating) => {
        setValue("courseRating", newRating);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

            {/* Modal content */}
            <div className="bg-richblack-800 p-6 rounded shadow-lg flex flex-col gap-4 max-w-md mx-4 relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold text-richblack-5">Add Review</p>
                    <button
                        onClick={() => setReviewModal(false)}
                        className="text-richblack-5 hover:text-richblack-50"
                    >
                        <MdOutlineClose size={24} />
                    </button>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4">
                    <img
                        src={user?.image}
                        alt='User'
                        className='aspect-square rounded-full object-cover w-[50px]'
                    />
                    <div>
                        <p className="text-white font-semibold text-lg">{user?.firstName} {user?.lastName}</p>
                        
                    </div>
                </div>
                <p className="text-white">Posting Publicly</p>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-4">
                    <ReactStars
                        count={5}
                        onChange={ratingChanged}
                        size={24}
                        activeColor="#ffd700"
                    />
                    <div className="flex flex-col gap-2">
                        <label htmlFor="courseExperience" className="text-richblack-5">Add your Experience</label>
                        <textarea
                            id="courseExperience"
                            placeholder='Add your experience'
                            {...register("courseExperience", { required: true })}
                            className='form-style min-h-[130px] min-w-[400px] w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        {errors.courseExperience && (
                            <span className="text-pink-50 text-sm">Please add your experience</span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setReviewModal(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-richblack-5 px-4 py-2 rounded transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseReviewModal;
