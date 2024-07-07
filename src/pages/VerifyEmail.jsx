// import React from "react";
import { useDispatch, useSelector } from "react-redux";
import OtpInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/operations/authApi"
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../services/operations/authApi";

const VerifyEmail = () => {

    const { signupData, loading } = useSelector((state) => state.auth);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const resend = true;

    useEffect(() => {
        if (!signupData) {
            navigate("/signup");
        }
    });
    // console.log(signupData);

    const handleOnSubmit = (e) => {
        e.preventDefault();

        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmpassword
        } = signupData;

        dispatch(
            signUp(
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmpassword,
                otp,
                navigate
            )
        );
    };
    return (
        <div className="mt-20">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="text-richblack-25 flex flex-col items-center justify-center bg-richblack-800">
                    <div className="text-xl font-bold border-2 border-richblack-100 p-4 rounded-lg shadow-md hover: ">Verify Email</div>
                    <br />
                    <p>A verification code has been sent to you. Enter the code below</p>
                    <br />
                    <br />
                    <form onSubmit={handleOnSubmit}>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    placeholder="-"
                                    style={{
                                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                    }}
                                    className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                                />
                            )}
                            containerStyle={{
                                justifyContent: "space-between",
                                gap: "0 6px",
                            }}
                        />
                        <div className="flex  justify-center mb-3 mt-3">
                            <button
                            type="submit"
                            className="border-2 border-richblack-100 font-bold p-3 transition-transform duration-200 transform hover:scale-95">
                                Verify Email
                            </button>
                        </div>
                    </form>
                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                        <p className="border-2 border-richblack-100 font-bold p-3 mt-5 transition-transform duration-200 transform hover:scale-95 text-sm">Back to Login</p>
                        </Link>
                        <button
                        type="submit"
                        className="border-2 border-richblack-100 font-bold p-3 mt-5 transition-transform duration-200 transform hover:scale-95 text-sm"
                        onClick={() => dispatch(sendOtp(signupData.email, navigate))}
                        >
                        Resend OTP
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;