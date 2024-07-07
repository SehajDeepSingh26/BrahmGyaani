// import React from 'react'
import {FaArrowRight} from "react-icons/fa"
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



function Home() {
  return (
    <div className="mt-20 relative z-10">
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
                Empower your future with <HighlightText text={"Coding Skills"} />{" "}
            </div>
            <div className=" mt-5 w-[65%]  text-center text-[15px] text-richblack-300 font-bold">
                with our online coding course , you can learn at your own pace , from anywhere in the world and get access to a wealth of resourcces, including hands-on projects , quizzes and personalised feedback from instructor{" "}
            </div>

            <div className="flex gap-7 mt-10">
                <CTAButton active={true} linkTo={"/signup"}>
                    Learn More
                </CTAButton>
                <CTAButton active={false} linkTo={"/login"}>
                    Book a Demo
                </CTAButton>
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
                            <HighlightText text={" coding potential "}/>
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
                        linkTo: "/login",
                        active: false,
                    }}
                    codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css"></head>\n<body>\n<h1><a href="/">Header</a></h1>\n <nav><a href="maxi">Hello</a></nav>\n</body>\n</html>`}
                    codeColor={"text-yellow-25"}
                />
            </div>
            
            {/* second section  */}
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
                        linkTo: "/login",
                        active: false,
                    }}
                    codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css"></head>\n<body>\n<h1><a href="/">Header</a></h1>\n <nav><a href="maxi">Hello</a></nav>\n</body>\n</html>`}
                    codeColor={"text-yellow-25"}
                />
            </div>

            <ExploreMore />
        </div>

        {/* Section 2 */}
        <div className="bg-pure-greys-5 border  text-richblack-700 relative mt-[-100px]">
            <div className="homepage_bg h-[400px] ">
                <div className="w-11/12 max-w-maxContent flex items-center gap-5 mx-auto  justify-center ">
                    <div className="  flex gap-7  text-white mt-[100px] ">
                        <div className=" flex gap-7    mt-[200px]">
                            <CTAButton active={true} linkTo={"/login"}>
                                <div className="flex items-center gap-2">
                                    Explore Full Catalog
                                    <FaArrowRight />
                                </div>
                            </CTAButton>

                            <CTAButton active={false} linkTo={"/signup"}>
                                <div>Learn More</div>
                            </CTAButton>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-11/12  mx-auto max-w-maxContent flex flex-col items-center justify-between gap-7">
                <div className="flex gap-5 mb-10 mt-[95px]">
                    <div className=" text-4xl font-semibold w-[45%]">
                        Get the skill you need for a
                        <HighlightText text={"Job that is in demand"}> </HighlightText>
                    </div>
                    <div className="flex flex-col gap-10 w-[40%] items-start">
                        <div className="text-[16px]">
                            The modern StudyNotion is the dictates its own terms. Today, to
                            be a competitive specialist requires more than professional
                            skills.
                        </div>
                        <CTAButton active={true} linkTo={"/signup"}>
                            <div>Learn More</div>
                        </CTAButton>
                    </div>
                </div>

                <TimelineSection />

                <LearningLanguageSection />
            </div>
      </div>

        {/* Section 3 */}
        <div className="w-11/12  mx-auto max-w-maxContent mt-0 flex items-center flex-col justify-between gap-8 bg-richblack-900 text-white  ">
            <InstructorSection />
            <h2 className="text-center text-4xl font-semibold m-10">
                Review from other learners
            </h2>
            {/* Review slider here */}
        </div>

      {/* Footer */}
      <Footer />

        {/* Section 4 */}

        {/* FOOTER */}
        {/* <Footer/> */}


    </div>
  )
}

export default Home
