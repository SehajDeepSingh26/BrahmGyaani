import React, { useEffect, useState } from 'react'
import {RatingStars} from '../../Common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const CourseCard = ({course, Height}) => {


    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])


    
  return (
    <div>
        <Link to={`/courses/${course._id}`}>
            <div className='ml-10 mr-5 w-10/12'>
                <div>
                    <img 
                        src={course?.thumbnail}
                        alt='course ka thumbnail'
                        className={`${Height}  rounded-xl object-cover`}
                    />
                </div>
                <div>
                    <p>{course?.courseName}</p>
                    <p>{course?.instructor?.firstName} {course?.instructor?.lastName} </p>
                    <div className='flex gap-x-3'>
                        <span>{avgReviewCount || 0}</span>
                        <RatingStars Review_Count={avgReviewCount} />
                        <span>{course?.ratingAndReviews?.length} Ratings</span>
                    </div>
                    <p>{course?.price}</p>
                </div>
            </div>
        </Link>

      
    </div>
  )
}

export default CourseCard
