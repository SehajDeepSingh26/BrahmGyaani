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
                    <div className="text-xl font-bold border-2 border-gray-300 p-4 rounded-lg shadow-md hover: ">Verify Email</div>
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
                        <button type="submit">Verify Email</button>
                    </form>
                    <div>
                        <Link to="/login">
                            <p>Back to Login</p>
                        </Link>
                    </div>

                    <button onClick={() => dispatch(sendOtp(signupData.email))}>
                        Resend it
                    </button>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;