import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authApi";

const ForgotPassword = () => {
    const { loading } = useSelector((state) => state.auth);
    const [emailSent, setEmailSent] = useState(false);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
    };

    return (
        <div className="">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="text-richblack-25 flex flex-col items-center justify-center bg-richblack-800">
                    <h1 className="text-xl  mt-20 font-bold border-2 border-richblack-100 p-4 rounded-lg shadow-md">
                        {!emailSent ? "Reset Your Password" : "Check Your Email"}
                    </h1>
                    <br />
                    <p className="max-w-[900px] text-center">
                        {!emailSent
                            ? "Have no fear, we'll email you instructions to reset your password. If you don't have access to your email, we can try account recovery."
                            : `We have sent the reset email to ${email}.`}
                    </p>
                    <br />
                    <br />
                    <form onSubmit={handleOnSubmit} className="flex flex-col ">
                        {!emailSent && (
                            <div className="flex flex-row items-center gap-10 translate-x-[-90px]">
                                <label className="label-style">
                                    Email Address:
                                </label>
                                <input
                                    className="form-style w-max-[100px] border-2 border-richblack-100 p-2 rounded-lg bg-richblack-800 text-richblack-5"
                                    required
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your Email Address"
                                />
                            </div>
                        )}
                        <div className="flex flex-row justify-center mb-3 translate-x-[-10px] gap-10 mt-10">
                            <button
                                type="submit"
                                className="border-2 border-richblack-100 font-bold p-3 transition-transform duration-200 transform hover:scale-95"
                            >
                                {!emailSent ? "Reset Password" : "Resend Email"}
                            </button>
                        <Link to="/login">
                            <p className="border-2 border-richblack-100 font-bold p-3 transition-transform duration-200 transform hover:scale-95">
                                Back to Login
                            </p>
                        </Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
