import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from "../../../Common/IconBtn"
import { buyCourse } from '../../../../services/operations/StudentFeaturesAPI'
import { useNavigate } from 'react-router-dom'

const RenderTotalAmount = () => {
    const { total, cart } = useSelector((state) => state.cart)
    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id)
         buyCourse( courses, token, user, navigate, dispatch )
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-5">
            <p className="text-xl font-semibold mb-2">Total Amount</p>
            <p className="text-3xl font-bold text-yellow-400 mb-6">Rs {total}</p>
            
            <IconBtn
                text="Buy Now"
                onclick={handleBuyCourse}
                customClasses="w-full justify-center bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md"
            />
        </div>
    )
}

export default RenderTotalAmount
