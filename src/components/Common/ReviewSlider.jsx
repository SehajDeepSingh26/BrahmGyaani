import React, { useEffect, useState } from 'react'

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay, FreeMode, Pagination, Navigation } from 'swiper/modules';
import ReactStars from 'react-stars'
import { apiConnector } from '../../services/apiConnector'

import { ratingsEndpoints } from '../../services/apis'
import { GiNinjaStar } from 'react-icons/gi'

const ReviewSlider = () => {

    const [reviews, setReviews] = useState([])
    const truncateWords = 15;

    useEffect(() => {
        const fetchAllReviews = async () => {
            const response = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)

            if (response?.data?.success) {
                setReviews(response?.data?.data)
            }
        }
        fetchAllReviews();
    }, [])

    return (
        <div className='text-white bg-gray-900 py-8'>
            <div className='h-[300px] max-w-6xl mx-auto'>
                <Swiper
                    slidesPerView={3}
                    spaceBetween={24}
                    loop={true}
                    freeMode={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    modules={[FreeMode, Pagination, Autoplay]}
                    className='w-full'
                >
                    {
                        reviews.map((review, index) => (
                            <SwiperSlide key={index} className='bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-white max-w-maxcontent'>
                                <div className='flex items-center mb-4'>
                                    <img
                                        src={review?.user?.image ? review?.user?.image : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName}_${review?.user?.lastName}`}
                                        alt='profile-pic'
                                        className='h-12 w-12 rounded-full object-cover mr-4'
                                    />
                                    <div>
                                        <p className='font-semibold'>{review?.user?.firstName} {review?.user?.lastName}</p>
                                        <p className='text-sm text-gray-400'>{review?.course?.courseName}</p>
                                    </div>
                                </div>
                                <p className='text-gray-300 mb-4'>
                                    {review?.review?.split(' ').slice(0, truncateWords).join(' ') + (review?.review?.split(' ').length > truncateWords ? '...' : '')}
                                </p>
                                <ReactStars
                                    count={5}
                                    size={24}
                                    value={review?.rating.toFixed(1)}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<GiNinjaStar />}
                                    fullIcon={<GiNinjaStar />}
                                />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default ReviewSlider
