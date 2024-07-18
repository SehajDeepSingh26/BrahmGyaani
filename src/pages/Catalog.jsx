import React, { useEffect, useState } from 'react'
import Footer from '../components/Common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CourseCard from '../components/Core/Catalog/CourseCard';
import CourseSlider from '../components/Core/Catalog/CourseSlider';
import Error from "../pages/Error"
import { useSelector } from 'react-redux';



const Catalog = () => {
    const { loading } = useSelector((state) => state.profile);
    const { catalogName } = useParams();
    const [active, setActive] = useState(1);
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    // Fetch All Categories
    useEffect(() => {
        const getCategories = async () => {
            const res = await apiConnector("GET", categories.CATEGORIES_API)
            // console.log("-----------=====", res)

            const category_id = res?.data?.allCategory?.filter(
                (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id
            setCategoryId(category_id)

        }
        getCategories();
    }, [catalogName])

    useEffect(() => {
        const getCategoryDetails = async () => {
            try {
                const res = await getCatalogPageData(categoryId)
                setCatalogPageData(res)
                // console.log(res)
            } catch (error) {
                console.log(error)
            }
        }
        if (categoryId)
            getCategoryDetails();
    }, [categoryId])

    if (loading || !catalogPageData) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)]     place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!loading && !catalogPageData.success) 
        return <Error />;
    

    return (
        <div className='m-20 text-white'>

            {/* Hero Section */}
            <div className=" box-content bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                    <p className="text-sm text-richblack-300">
                        {`Home / Catalog / `}
                        <span className="text-yellow-25">
                            {catalogPageData?.data?.selectedCategory?.name}
                        </span>
                    </p>
                    <p className="text-3xl text-richblack-5">
                        {catalogPageData?.data?.selectedCategory?.name}
                    </p>
                    <p className="max-w-[870px] text-richblack-200">
                        {catalogPageData?.data?.selectedCategory?.description}
                    </p>
                </div>
            </div>

            {/* Section 1 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading text-2xl mb-5">Courses to get you started</div>
                
                <div>
                    <CourseSlider
                        Courses={catalogPageData?.data?.selectedCategory?.courses}
                    />
                </div>
            </div>
            {/* Section 2 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading text-2xl mb-5">
                    Top courses in {catalogPageData?.data?.differentCategory?.name}
                </div>
                <div className="py-8">
                    <CourseSlider
                        Courses={catalogPageData?.data?.differentCategory?.courses}
                    />
                </div>
            </div>

            {/* Section 3 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading text-2xl">Frequently Bought</div>
                <div className="py-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {catalogPageData?.data?.mostSellingCourses
                            ?.slice(0, 4)
                            .map((course, i) => (
                                <CourseCard course={course} key={i} Height={"h-[400px]"} />
                            ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Catalog
