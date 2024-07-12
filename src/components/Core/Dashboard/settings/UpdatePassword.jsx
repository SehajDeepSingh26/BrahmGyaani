import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../Common/IconBtn"

const UpdatePassword = () => {
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const [showpassword, setShowpassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showconfirmpassword, setShowconfirmpassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const submitPasswordForm = async (data) => {
        // console.log("password Data - ", data)
        try {
            await changePassword(token, data)
        } catch (error) {
            console.log("ERROR MESSAGE - ", error.message)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(submitPasswordForm)}>
                <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                    <h2 className="text-lg font-semibold text-richblack-5">Password</h2>

                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="relative flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="password" className="label-style text-richblack-5">
                                Current Password
                            </label>
                            <input
                                type={showpassword ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="Enter Current Password"
                                className="form-style"
                                {...register("password", { required: true })}
                            />
                            <span
                                onClick={() => setShowpassword((prev) => !prev)}
                                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                            >
                                {showpassword ? (
                                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                ) : (
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                )}
                            </span>
                            {errors.password && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your Current Password.
                                </span>
                            )}
                        </div>
                        <br />

                        <div className="relative flex flex-col gap-2 lg:w-[48%]">
                            <label htmlFor="newPassword" className="label-style text-richblack-5">
                                New Password
                            </label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                id="newPassword"
                                placeholder="Enter New Password"
                                className="form-style"
                                {...register("newPassword", { required: true })}
                            />
                            <span
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                            >
                                {showNewPassword ? (
                                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                ) : (
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                )}
                            </span>
                            {errors.newPassword && (
                                <span className="-mt-1 text-[12px] text-yellow-100">
                                    Please enter your New Password.
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="relative flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="confirmpassword" className="label-style text-richblack-5">
                            Confirm Password
                        </label>
                        <input
                            type={showconfirmpassword ? "text" : "password"}
                            name="confirmpassword"
                            id="confirmpassword"
                            placeholder="Confirm New Password"
                            className="form-style border-2 border-yellow-400"
                            {...register("confirmpassword", { required: true })}
                        />
                        <span
                            onClick={() => setShowconfirmpassword((prev) => !prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        >
                            {showconfirmpassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                        {errors.confirmpassword && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please confirm your New Password.
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            navigate("/dashboard/my-profile")
                        }}
                        className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                    >
                        Cancel
                    </button>
                    <IconBtn type="submit" text="Update" />
                </div>
            </form>
        </>
    )
}

export default UpdatePassword
