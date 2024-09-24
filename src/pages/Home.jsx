// import React from 'react'
import { FaArrowRight } from "react-icons/fa"
import { Link } from 'react-router-dom'
import "../App.css"
import HighlightText from "../components/Core/Homepage/HighlightText"
import CTAButton from "../components/Core/Homepage/CTAButton"
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/Core/Homepage/CodeBlock"
import Footer from "../components/Common/Footer"
import TimelineSection from "../components/Core/Homepage/TimelineSection"
import LearningLanguageSection from "../components/Core/Homepage/LearningLanguageSection"
import InstructorSection from "../components/Core/Homepage/InstructorSection"
import ExploreMore from "../components/Core/Homepage/ExploreMore"
import ReviewSlider from "../components/Common/ReviewSlider"



function Home() {
    return (
        <div className="mt-20 relative z-1">
            {/* Section - 1 */}
            <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between">

                <div className="group flex mt-5 mx-auto p-1 rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 hover:shadow-[0px_0px_10px_0px_rgba(255,255,255,1)]  ">
                    <Link to={"/signup"}>
                        <div className=" w-full flex  items-center justify-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </Link>
                </div>

                <div className="text-center text-4xl font-semibold mt-7">
                    Empower your future with <HighlightText text={"Coding Skills"} />
                </div>
                <div className=" mt-5 w-[65%] text-center text-[15px] text-richblack-300 font-bold">
                    We believe in the transformative power of education and reflection. Inspired by the profound wisdom of Guru Granth Sahib Ji, our mission is to create an EdTech platform that not only imparts knowledge but also encourages deep contemplation and reflection, leading to a life of benevolence and service.
                </div>

                <div className="flex gap-7 mt-10">
                    <CTAButton active={true} linkTo={"/about"}>
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkTo={"/login"}>
                        Book a Demo
                    </CTAButton>
                </div>

                <div className="w-9/12">
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Start
                                <HighlightText text={" Coding "}></HighlightText>
                                <br></br>
                                <HighlightText text={" in Seconds"}></HighlightText>
                            </div>
                        }
                        subheading={
                            " Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }
                        ctabtn1={{
                            btnText: "Try it Yourself",
                            linkTo: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            linkTo: "/about",
                            active: false,
                        }}
                        codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css"></head>\n<body>\n<h1><a href="/">Header</a></h1>\n <nav><a href="maxi">Hello</a></nav>\n</body>\n</html>`}
                        codeColor={"text-yellow-25"}
                    />
                </div>

                <div className="shadow-[10px_10px_2px_0px_rgba(255,255,255,1),_-1px_-1px_20px_0px_]  mx-3 my-14 w-8/12 ">
                    <video muted loop autoPlay>
                        <source src={Banner} type="video/mp4" />
                    </video>
                </div>

                {/* code section -1 */}
                <div className="w-9/12">
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock Your
                                <HighlightText text={" coding potential "} />
                                with our online courses
                            </div>
                        }
                        subheading={
                            "Sharing their knowledge with you "
                        }
                        ctabtn1={{
                            btnText: "Try it Yourself",
                            linkTo: "/signup",
                            active: true,
                        }}
                        ctabtn2={{
                            btnText: "Learn More",
                            linkTo: "/about",
                            active: false,
                        }}
                        codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css"></head>\n<body>\n<h1><a href="/">Header</a></h1>\n <nav><a href="maxi">Hello</a></nav>\n</body>\n</html>`}
                        codeColor={"text-yellow-25"}
                    />
                </div>

                {/* second section  */}
                

            </div>

            {/* Section 3 */}
            <div className="w-11/12  mx-auto max-w-maxContent mt-10 flex items-center flex-col justify-between gap-1 bg-richblack-900 text-white  ">
                <InstructorSection />
                <h2 className="text-center text-4xl font-semibold mt-10 m-5">
                    Review from other learners
                </h2>
                {/* Review slider here */}
                <ReviewSlider />
            </div>

            {/* Footer */}
            <Footer />


        </div>
    )
}

export default Home
