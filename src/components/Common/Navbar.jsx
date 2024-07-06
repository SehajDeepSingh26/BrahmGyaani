/* eslint-disable no-unused-vars */
// import React from 'react'
import { useSelector } from "react-redux"
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { Link, matchPath } from "react-router-dom"
import { useLocation } from "react-router-dom" 
import { TiShoppingCart } from "react-icons/ti";
import {ProfileDropdown} from "../Core/auth/ProfileDropdown"
import { useState, useEffect } from "react"
import {apiConnector} from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { IoIosArrowDropdownCircle } from "react-icons/io"

const Navbar = () => {

    const {token} = useSelector( (state) => state.auth);
    const {user} = useSelector( (state) => state.profile);
    const {totalItems} = useSelector( (state) => state.cart);

    const location = useLocation()

    const [subLinks, setSubLinks] = useState([]);
    const fetchSubLinks = async() => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API)   
            //^ this is how we call the api
            setSubLinks(result.data)
        } catch (error) {
            console.log("Could not fetch categories list", error)
            
        }
    }

    useEffect( () => {
        fetchSubLinks();
    }, [subLinks.length])
    console.log(subLinks)

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname)
    }
    return (
        <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 w-full fixed top-0">
            <div className="w-11/12 flex max-w-maxContent items-center justify-between">
                <Link to="/">
                    <img src={logo} width={160} height={132}/>
                </Link>

                {/* ?Nav Links */}
                <nav>
                    <ul className="flex gap-x-6 text-richblack-25">
                        {
                            NavbarLinks.map((link, index) => (
                                 <li key={index}>{
                                    link.title === "Catalog" ?(
                                    <div className="relative group flex items-center gap-2">
                                        <p>{link.title}</p>
                                        <IoIosArrowDropdownCircle/>
                                        {/* //^ draw shape for categories when hovered (rotated sqaure + rectangle) */}
                                        <div className="invisible absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[10%] flex flex-col rounded-md bg-richblack-5 p-4 opacity-0 text-richblack-900  transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] ">
                                            <div className="absolute left-[50%] top-0 h-6 w-6 rotate-45 rounded bg-richblack-5 translate-y-[-40%] translate-x-[80%] ">
                                            </div>

                                            {
                                                subLinks ? 
                                                    subLinks.allCategory?.map((category, count) => (
                                                        <Link key={count} to={`/category/${category.name}`}>
                                                            {category.name}
                                                        </Link>
                                                    ))
                                                : (<div></div>)
                                            }
                                        </div>



                                    </div>) : 
                                        <Link to={link?.path}>
                                            <p className={`${matchRoute(link?.path) ? "text-yellow-25": "text-richblack-25"}`}>{link.title}</p>
                                        </Link>
                                    }
                                </li>
                            ))
                            
                        }

                    </ul>
                </nav>

                {/* Login -- signUp-- dashboard */}
                <div className="flex gap-4 items-center text-white">
                    {
                        user && user?.accountType != "Instructor" && (
                            <Link to={"/dashboard/cart"} className="relative">
                                <TiShoppingCart />
                                {
                                    totalItems>0 && (
                                        <span>{totalItems}</span>
                                    )
                                }
                            </Link>
                        ) 
                    }
                    {
                        token === null && (
                            <Link to={"/login"}>
                                <button className="border border-richblack-700 bg-richblack-800 text-richblack-25 p-1 px-4 rounded-md  hover:scale-95">
                                    LogIn
                                </button>
                            </Link>
                        )
                    }
                    {
                        // token === null && (
                        //     <Link to={"/signup"}>
                        //         <button className="border border-richblack-700 bg-richblack-800 text-richblack-25 p-1 px-4 rounded-md  hover:scale-95">
                        //             SignUp
                        //         </button>
                        //     </Link>
                        // )
                    }
                    {
                        token === null &&   <ProfileDropdown/>
                        
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar

