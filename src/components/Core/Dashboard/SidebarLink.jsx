import React from 'react'
import * as Icons from "react-icons/vsc"
import { matchPath, NavLink, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { IoSettings } from "react-icons/io5";


const SidebarLink = ({ link, iconName}) => {
    
    const Icon = iconName==="IoSettings" ? IoSettings : Icons[iconName]
    const location = useLocation();
    const dispatch = useDispatch();

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname)
    }
    return (
        <NavLink
        to={link.path}
        //   onClick
        className={`relative px-8 py-2 text-sm font-medium text-richblack-5 ${matchRoute(link.path) ? "bg-yellow-100 text-richblack-800" : "bg-opacity-0"}`}
        >
            <span className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 ${matchRoute(link.path) ? "opacity-100" : "opacity-0"} `} >
                
            </span>

            <div className="flex items-center gap-x-2">
                {Icon && <Icon className="text-lg"/>}
                <span>{link.name}</span>
            </div>

        </NavLink>
    )
}

export default SidebarLink
