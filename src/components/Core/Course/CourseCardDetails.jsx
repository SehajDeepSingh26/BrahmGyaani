import copy from 'copy-to-clipboard';
import React from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../../slice/cartSlice';

const CourseCardDetails = ({ course, setConfirmationModal, handleBuyCourse }) => {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        thumbnail: ThumbnailImage,
        price: price,
    } = course;

    const handleAddToCart = async () => {
        if (user && user.accountType === "Instructor") {
            toast.error("You are an instructor, you can't buy a course");
            return;
        }
        if (token) {
            dispatch(addToCart(course));
            return;
        }

        setConfirmationModal({
            text1: "You are not logged in",
            text2: "Please login to add courses to your cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null)
        });
    };

    const handleShare = (e) => {
        copy(window.location.href);
        toast.success("Link copied to clipboard");
    };

    return (
        <div className='flex flex-col p-5 bg-richblack-600 rounded-xl shadow-lg '>
            <img src={ThumbnailImage} alt="thumbnail" className='max-h-[300px] w-[400px] rounded-xl mb-4' />
            <div className='text-white text-xl mb-4'>
                Rs. {price}
            </div>
            <div className='mb-4'>
                <button
                    className='bg-blue-500 text-white px-4 py-2 rounded-md w-full mb-2'
                    onClick={
                        user && course.studentsEnrolled.includes(user?._id)
                            ? () => navigate("/dashboard/enrolled-courses")
                            : handleBuyCourse
                    }
                >
                    {user && course.studentsEnrolled.includes(user?._id) ? "Go to Course" : "Buy Now"}
                </button>
                {!course?.studentsEnrolled.includes(user?._id) && (
                    <button
                        className='bg-brown-500 text-white px-4 py-2 rounded-md w-full'
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                )}
            </div>
            <div className='text-white mb-4'>
                <p className='mb-2'>30 day Money back Guarantee</p>
                <p className='mb-2'>This course includes:</p>
                <ul className='list-disc list-inside flex flex-col gap-y-3 pl-4'>
                    {course?.instructions?.map((item, index) => (
                        <li key={index} className='flex gap-2'>
                            <span>-- {item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='flex items-center pl-28 translate-x-1'>
                <button
                    className='bg-blue-400 text-white px-4 py-2 rounded-md w-32 '
                    onClick={handleShare}
                >
                    Share
                </button>
            </div>
        </div>
    );
};

export default CourseCardDetails;
