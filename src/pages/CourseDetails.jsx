import React from 'react'

const CourseDetails = () => {
    const handleBuyCourse = () => {
        if (token) {
            buyCourse();
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
