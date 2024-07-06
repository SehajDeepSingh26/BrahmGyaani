/* eslint-disable no-unused-vars */
// import React from 'react'
import { useSelector } from "react-redux"
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { Link, matchPath } from "react-router-dom"
import { useLocation } from "react-router-dom" 
import { TiShoppingCart } from "react-icons/ti";
import profileDropdown from "../Core/auth/profileDropdown"
import { useState, useEffect } from "react"
import {apiConnector} from "../../services/apiConnector"
import { categories } from "../../services/apis"

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
            console.log(result.data.allCategory)
            console.log("Priting SubLinks result: ", subLinks);
        } catch (error) {
            console.log("Could not fetch categories list", error)

        }
    }

    useEffect( () => {
        fetchSubLinks();
    }, [])

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname)
    }
    return (
        <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ">
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
                                    link.title === "Catalog" ?(<div>
                                        <p>{link.title}</p>
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
                        token === null && (
                            <Link to={"/signup"}>
                                <button className="border border-richblack-700 bg-richblack-800 text-richblack-25 p-1 px-4 rounded-md  hover:scale-95">
                                    SignUp
                                </button>
                            </Link>
                        )
                    }
                    {
                        token !== null &&   <profileDropdown/>
                        
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar

