// import React from 'react'
import {FaArrowRight} from "react-icons/fa"
import { Link } from 'react-router-dom'
import "../App.css"
import HighlightText from "../components/Core/Homepage/HighlightText"
import CTAButton from "../components/Core/Homepage/CTAButton"
// import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/Core/Homepage/CodeBlock"


function Home() {
  return (
    <div>
        {/* Section - 1 */}
        <div className="relative mx-auto   flex flex-col w-11/12 items-center text-white justify-between ">

            <Link to={"/signup"}>
            <div className="group flex mt-16 mx-auto p-1   rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 hover:shadow-[0px_0px_10px_0px_rgba(255,255,255,1)]  ">
                <div className=" w-full flex  items-center justify-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                    <p>Become an Instructor</p>
                    <FaArrowRight />
                </div>
            </div>
            </Link>

            <div className="text-center text-4xl font-semibold mt-7">
                Empower your future with <HighlightText text={"Coding Skills"} />{" "}
            </div>
            <div className=" mt-5 w-[65%]  text-center text-[15px] text-richblack-300 font-bold">
                with our online coding course , you can learn at your own pace , from anywhere in the world and get access to a wealth of resourcces, including hands-on projects , quizzes and personalised feedback from instructor{" "}
            </div>

            <div className="flex gap-7 mt-10">
                <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                </CTAButton>
                <CTAButton active={false} linkto={"/login"}>
                    Book a Demo
                </CTAButton>
            </div>

            <div className="shadow-[10px_10px_2px_0px_rgba(255,255,255,1),_-1px_-1px_20px_0px_]  mx-3 my-14 w-8/12 ">
                {/* <video muted loop autoPlay>
                    <source src={Banner} type="video/mp4" />
                </video> */}
            </div>

            {/* code section -1 */}
            <div>
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
                        linkto: "/signup",
                        active: true,
                    }}
                    ctabtn2={{
                        btnText: "Learn More",
                        linkto: "/login",
                        active: false,
                    }}
                    codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet\n"href="styles.css">/head>body> \nh1<a href="/">Header</a>\n/h1>\n nav<a href="maxi">\nHello`}
                    codeColor={"text-yellow-25"}
                />
            </div>
            {/* second section  */}
            <div>
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
                        " Sharing their knowledge with you "
                    }
                    ctabtn1={{
                        btnText: "Try it Yourself",
                        linkto: "/signup",
                        active: true,
                    }}
                    ctabtn2={{
                        btnText: "Learn More",
                        linkto: "/login",
                        active: false,
                    }}
                    codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet\n"href="styles.css">/head>body>\nh1<a href="/">Header</a>\n/h1>\n nav<a href="maxi">\nHello`}
                    codeColor={"text-yellow-25"}
                />
            </div>

            {/* <ExploreMore /> */}
        </div>

        {/* Section 2 */}


        {/* Section 3 */}


        {/* Section 4 */}


    </div>
  )
}

export default Home
