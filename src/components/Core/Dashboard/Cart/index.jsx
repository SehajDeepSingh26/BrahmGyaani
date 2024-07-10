import React from 'react'
import { useSelector } from 'react-redux'
import RenderTotalAmount from './RenderTotalAmount'
import RenderCartCourses from './RenderCartCourses'

const Cart = () => {
    const { total, totalitems } = useSelector((state) => state.cart)

    return (
        <div className='text-white mt-10'>
            <h1 className='text-3xl font-bold mb-5'>Your Cart</h1>
            <p className='text-lg mb-5'>
                You have {totalitems > 0 ? totalitems : "no"} courses in your Wishlist
            </p>

            {total > 0 
                ? (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <RenderCartCourses />
                        <RenderTotalAmount />
                    </div>
                ) : (
                    <p className="text-lg text-red-500">Your Cart is empty</p>
                )
            }
        </div>
    )
}

export default Cart
