import React from 'react'
import { GiNinjaStar } from 'react-icons/gi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import ReactStars from 'react-stars'

const RenderCartCourses = () => {
    const { cart } = useSelector((state) => state.cart)
    const dispatch = useDispatch();

    return (
        <div className="space-y-6">
            {cart.map((course, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md">
                    <div className="flex items-center gap-4">
                        <img src={course?.thumbnail} alt={course?.coursename} className="w-20 h-20 rounded object-cover" />
                        <div>
                            <p className="text-lg font-semibold text-white">{course?.coursename}</p>
                            <p className="text-sm text-gray-400">{course?.category?.name}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-yellow-400 text-sm">4.8</span>
                                <ReactStars
                                    count={5}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<GiNinjaStar />}
                                    fullIcon={<GiNinjaStar />}
                                />
                                <span className="text-sm text-gray-400">({course?.ratingAndReviews?.length})</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => dispatch(removeFromCart(course._id))}
                            className="flex items-center gap-2 text-red-500 hover:text-red-700"
                        >
                            <RiDeleteBin6Line size={20} />
                            <span className="hidden sm:inline">Remove</span>
                        </button>
                        <p className="text-lg font-semibold text-white">{course?.price}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RenderCartCourses
