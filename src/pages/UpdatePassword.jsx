import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { resetPassword } from "../services/operations/authApi";

const UpdatePassword = () => {
    const { loading } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };

    const { password, confirmPassword } = formData;
    const dispatch = useDispatch();
    const location = useLocation();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password, confirmPassword, token));
    };

    return (
        <div className="">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="text-richblack-25 flex flex-col items-center bg-richblack-800">
                    <h1 className="text-xl mt-20 font-bold border-2 border-richblack-100 p-4 rounded-lg shadow-md">
                        Choose New Password
                    </h1>
                    <br />
                    <p className="max-w-[900px] text-center">
                        Almost done. Enter your new password and you are all set.
                    </p>
                    <br />
                    <br />
                    <form className="text-richblack-5 flex flex-col items-center" onSubmit={handleOnSubmit}>
                        <div className="flex flex-row items-center gap-10 translate-x-[-90px]">
                            <label className="label-style">
                                New Password*:
                            </label>
                            <input
                                className="form-style w-max-[100px] border-2 border-richblack-100 p-2 rounded-lg bg-richblack-800 text-richblack-5"
                                required
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={handleOnChange}
                                placeholder="Password"
                            />
                            <span onClick={() => setShowPassword((prev) => !prev)}>
                                {showPassword ? <FaEyeSlash fontSize={24} /> : <FaEye fontSize={24} />}
                            </span>
                        </div>
                        <br />
                        <div className="flex flex-row items-center gap-10 translate-x-[-90px]">
                            <label className="label-style">
                                Confirm Password:
                            </label>
                            <input
                                className="form-style w-max-[100px] border-2 border-richblack-100 p-2 rounded-lg bg-richblack-800 text-richblack-5"
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleOnChange}
                                placeholder="Confirm Password"
                            />
                            <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                {showConfirmPassword ? <FaEyeSlash fontSize={24} /> : <FaEye fontSize={24} />}
                            </span>
                        </div>
                        <div className="flex flex-row justify-center mb-3 translate-x-[-10px] gap-10 mt-10">
                            <button
                                type="submit"
                                className="border-2 border-richblack-100 font-bold p-3 transition-transform duration-200 transform hover:scale-95"
                            >
                                Reset Password
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

export default UpdatePassword;
