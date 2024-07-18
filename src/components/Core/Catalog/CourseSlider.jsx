import React from 'react'

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import CourseCard from './CourseCard'

const CourseSlider = ({ Courses }) => {
    return (
        <div>
            {
                Courses?.length ? (
                    <Swiper
                        slidesPerView={1}
                        loop={true}
                        spaceBetween={100}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                        breakpoints={{
                            1024:{slidesPerView:2}
                        }}
                    >
                        {
                            Courses?.map((course, index) => (
                                <SwiperSlide key={index}>
                                    <CourseCard course={course} Height={"h-[250px]"} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                ) : (
                    <p>No Course Found !!</p>
                )
            }
        </div>
    )
}

export default CourseSlider
