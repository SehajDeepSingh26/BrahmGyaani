import React, { useEffect, useState } from 'react'
import Footer from '../components/Common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';
import getCatalogPageData from '../services/operations/pageAndComponentData';
import CourseCard from '../components/Core/Catalog/CourseCard';
import CourseSlider from '../components/Core/Catalog/CourseSlider';

// TIME ---> 1:19:00 4lec

const Catalog = () => {
    const {catalogName} = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null)
    const [categoryId, setCategoryId] = useState("");

    // Fetch all categories
    useEffect(() => {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API)
            // console.log("-----------=====", res)
            
            const category_id = res?.data?.allCategory?.filter(
                (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id
            setCategoryId(category_id)

        }
        getCategories();
    }, [catalogName])

    useEffect(() => {
        const getCategoryDetails = async() => {
            try {
                const res = await getCatalogPageData(categoryId)
                setCatalogPageData(res)
            } catch (error) {
                console.log(error)
            }
        }
        getCategoryDetails(); 
    }, [categoryId])

    return (
        <div className='mt-20 text-white'>
            
            <div>
                <p>{`HOME / CATALOG/ `}
                    <span>
                        {catalogPageData?.data?.selectedCategory?.name}
                    </span>
                </p>
                <p>
                    {catalogPageData?.data?.selectedCategory?.name} 
                </p>
                <p>
                    {catalogPageData?.data?.selectedCategory?.description}
                </p>
            </div>

            <div>
                {/* Section1 */}
                <div>
                    <div>Courses to get you started</div>
                    <div className='flex gap-x-4'>
                        <p>Most Popular</p>
                        <p>New</p>
                    </div>
                    <div>
                        <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
                    </div>
                </div>

                {/* Section 2 */}
                <div>
                        
                    <p>Top Courses in {catalogPageData?.data?.differentCategory?.name}</p> 
                    <div>
                        <CourseSlider Courses={catalogPageData?.data?.differentCategory?.name} />
                    </div>
                </div>

                {/* Section 3 */}
                <div>
                    <div>Frequently Bought</div>
                    <div className='py-8'>
                        <div className='grid grid-cols-1 lg:grid-cols-2'>
                            {
                                catalogPageData?.data?.mostSellingCourses?.slice(0,4)
                                    .map((course, index) => (
                                        <CourseCard course={course} key={index} height={"h-[140px]"} />
                                    ))
                            }
                        </div>
                    </div>


                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default Catalog
