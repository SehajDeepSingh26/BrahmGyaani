import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiEdit } from "react-icons/fi";
import IconBtn from "../../Common/IconBtn";

const MyProfile = () => {
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();

    return (
        <div className="mt-5 max-w-4xl ml-28 p-6 pt-0 bg-gray-100 shadow-lg rounded-lg space-y-5">
            <div className="flex flex-col pb-0 p-3 pt-0 shadow-md rounded-lg">
                <h1 className="text-3xl font-bold mb-1 text-richblack-5">
                    My Profile
                </h1>
            </div>

            {/* Section 1 */}
            <div className="p-6 bg-richblack-800 shadow-md rounded-lg">
                <div className="flex flex-row gap-10 items-center justify-between">
                    <div className="flex items-center">
                        <img
                            src={`${user?.image}`}
                            alt={`profile-${user?.firstName}`}
                            className="w-[78px] h-[78px] rounded-full object-cover mr-4"
                        />
                        <div>
                            <p className="text-xl font-semibold text-richblack-5">
                                {user?.firstName + " " + user?.lastName}
                            </p>
                            <p className="text-sm text-richblack-5">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/dashboard/settings")}
                            className="flex items-center gap-2 bg-richblack-5 hover:bg-richblack-200 text-richblack-800 py-2 px-4 rounded-md"
                        >
                            <span>Edit</span>
                            <FiEdit />
                        </button>
                    </div>
                </div>
            </div>

            {/* Section 2 */}
            <div className="p-6 bg-richblack-800 shadow-md rounded-lg">
                <div className="flex flex-col gap-3 items-start">
                    <div className="flex flex-row gap-10 items-center justify-between w-full">
                        <p className="text-xl font-semibold text-richblack-5">About</p>
                        <p className="text-sm text-richblack-50">
                            {user?.additionalDetails?.about ? user?.additionalDetails?.about : "Something About Yourself"}
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/dashboard/settings")}
                                className="flex items-center gap-2 bg-richblack-5 hover:bg-richblack-200 text-richblack-800 py-2 px-4 rounded-md"
                            >
                                <span>Edit</span>
                                <FiEdit />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3 */}
            <div className="p-6 bg-richblack-800 shadow-md rounded-lg">
                <div className="flex flex-row gap-10 items-center justify-between mb-6">
                    <p className="text-xl font-semibold text-richblack-5">Personal Details</p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/dashboard/settings")}
                            className="flex items-center gap-2 bg-richblack-5 hover:bg-richblack-200 text-richblack-800 py-2 px-4 rounded-md"
                        >
                            <span>Edit</span>
                            <FiEdit />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-richblack-50">First Name</p>
                        <p className="text-md text-richblack-5">{user?.firstName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-richblack-50">Last Name</p>
                        <p className="text-md text-richblack-5">{user?.lastName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-richblack-50">Email</p>
                        <p className="text-md text-richblack-5">{user?.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-richblack-50">Gender</p>
                        <p className="text-md text-richblack-5">{user?.additionalDetails?.gender ?? "Add Gender"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-richblack-50">Phone Number</p>
                        <p className="text-md text-richblack-5">{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-richblack-50">Date of Birth</p>
                        <p className="text-md text-richblack-5">{user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
