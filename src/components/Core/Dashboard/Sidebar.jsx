import React, {  useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import {logout} from "../../../services/operations/authApi"
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from "./SidebarLink"
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../../Common/ConfirmationModal'

const Sidebar = () => {

    const { user, loading: profileLoading } = useSelector((state) => state.profile);
    const { loading: authLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationmodal, setConfirmationmodal] = useState(null)

    if(profileLoading || authLoading) {
        return(
            <div className='mt-10'>
                Loading...
            </div>
        )}

    return (
        <div className='flex flex-col gap-5 items-center min-w-[222px] border-r-[1px] border-richblue-700 h-[calc(100vh-3.5rem)] bg-richblack-800 py-10'>
            <div className="flex flex-col gap-3 ">
                {
                    sidebarLinks.map((link, index) => {
                        if(link.type && user?.accountType !== link.type)
                            return null;

                        return(
                            <SidebarLink key={index} link={link} iconName={link.icon} />
                        )
                    })
                }
            </div>
            
            {/* Settings */}
            <div className="mx-auto mt-6 mb=6 h-[1px] w-10/12 bg-richblac-600 ">
                <div className="flex flex-col items-center gap-3">
                    <SidebarLink
                        link={{name: "Settings", path: "dashboard/settings"}}
                        iconName="IoSettings"
                    />
                    
                    {/* Logout */}
                    <button
                        onClick={ () => setConfirmationmodal(
                            {
                                text1: "Are you sure?",
                                text2: "Logout ho jaaoge !?",
                                btn1Text: "Logout",
                                btn2Text: "Cancel",
                                btn1Handler: () => dispatch(logout(navigate)),
                                btn2Handler: () => setConfirmationmodal(null)
                            }
                        )}
                        className='text-sm font-medium text-richblack-300'
                    >
                        <div className='flex flex-row items-center gap-x-2'>
                            <VscSignOut className="text-lg" />
                            <span className=''>Logout</span>
                        </div>
                    </button>
                </div>
            </div>

            {
                confirmationmodal && <ConfirmationModal modalData={confirmationmodal} />
            }
            
        
        </div>
    )
}

export default Sidebar
