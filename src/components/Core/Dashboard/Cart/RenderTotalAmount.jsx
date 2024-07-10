import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from "../../../Common/IconBtn"

const RenderTotalAmount = () => {
    const { total, cart } = useSelector((state) => state.cart)

    const handleBuyCourse = async() => {
        const courses = cart.map((course) => course._id);
        console.log("Bought these courses: ", courses)
        // TODO API Integrate -> payment gateway
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
