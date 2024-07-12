import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import CourseInformationForm from './CourseInformation/CourseInformationForm'
import CourseBuilderForm from "./courseBuilder/CourseBuilderForm"

const RenderSteps = () => {
    const { step } = useSelector((state) => state.course)
    const steps = [
        {
            id: 1,
            title: "Course Information"
        },

        {
            id: 2,
            title: "Course Builder"
        },
        {
            id: 3,
            title: "Publish"
        },

    ]
    return (
        <div className='text-white'>
            <div>
                {
                    steps.map((item, index) => (
                        <div key={index}>
                            <div>
                                <div className={`${step === item.id ? "bg-yellow-900 border-yellow-50 text-yellow-50" : "border-richblack-700 bg-richblack-700 text-richblack-300"}`}>
                                    
                                    {
                                        step > item.id ? (<FaCheck />) : (
                                            item.id
                                        )  //^ if step is complted, done will be mrked
                                        
                                    }
                                </div>
                            </div>
                            {/* //TODO Add dashes */}
                        </div>
                    ))
                }
            </div>

            <div>
                {
                    steps.map((item, index) => (
                        <div key={index}>
                            <div>
                                <p>{item.title}</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            {step === 1 && <CourseInformationForm/>}
            {step === 2 && <CourseBuilderForm/>}
            {/* {step === 3 && <PublishCourse/>} */}
        </div>
    )
}

export default RenderSteps
