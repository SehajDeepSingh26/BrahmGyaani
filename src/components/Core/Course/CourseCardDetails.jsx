import copy from 'copy-to-clipboard'
import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToCart } from '../../../slice/cartSlice'

const CourseCardDetails = ({course, setConfirmationModal, handleBuyCourse}) => {
    const {user} = useSelector((state) => state.profile)
    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        thumbnail: ThumbnailImage,
        price: price
    } = course

    const handleAddToCart = async() => {
        if(user && user.accountType === "Instructor"){
            toast.error("You are an instructor, you cant buy a course")
            return;
        }
        if(token){
            dispatch(addToCart(course))
            return;
        }

        // setConfirmationModal({
        //     text1: "You are not logged in"
        // })
    }

    const handleShare = (e) => {
        copy(window.location.href)
        toast.success("Link copied to clipboard")
    }


    return (
        <div className='bg-richblack-400 flex flex-col p-5 absolute   translate-y-[100px] translate-x--[30px]'>
            <img src={ThumbnailImage} alt="thumbnail image" className='max-h-[300px] w-[400px] rounded-xl' />
            <div>
                Rs./{price}
            </div>
            {console.log(course)}
            <div>
                <button onClick={
                    user && user && course.studentsEnrolled.includes(user?._id) ? () => navigate("/dashboard/enrolled-courses") : handleBuyCourse
                }>
                    {
                        user && course.studentsEnrolled.includes(user?._id) ? "Go to Course" : "Buy Now"
                    }
                </button>
                
                {
                    (!course?.studentsEnrolled.includes(user?._id) && (
                        <button onClick={handleAddToCart}>Add to Cart</button>
                    ))
                }
            </div>

            <div>
                <p>
                    30 day Money back Gurantee
                </p>
                <p>
                    This course Includes
                </p>
                <div className='flex flex-col gap-y-3'>
                    {
                        course?.instructions?.map((item, index) => (
                            <p key={index} className='flex gap-2'>
                                <span>
                                    {item}
                                </span>
                            </p>
                        ))
                    }

                </div>
            </div>

            <div>
                <button onClick={handleShare}>
                    Share
                </button>
            </div>
        </div>
    )
}

export default CourseCardDetails
