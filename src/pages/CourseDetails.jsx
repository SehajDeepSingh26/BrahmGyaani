import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from "../services/operations/StudentFeaturesAPI";

const CourseDetails = () => {

    const {user} = useSelector((state) => state.profile)
    const {token} = useSelector((state) => state.auth)
    const dispatch = useDispatch
    const navigate = useNavigate();
    const courseId =  useParams();

    const handleBuyCourse = () => {
        if (token) {
            buyCourse([courseId], token, user, navigate, dispatch);
            return;
        }
    }
    return (
        <div className='flex items-center '>
            <button
                className='bg-yellow-200 p-6 mt-20'
                onClick={() => handleBuyCourse()}
            >
                Buy Now
            </button>
        </div>
    )
}

export default CourseDetails
