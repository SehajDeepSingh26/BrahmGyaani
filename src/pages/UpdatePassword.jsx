import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { resetPassword } from "../services/operations/authApi";

const UpdatePassword = () => {

    const { loading } = useSelector((state) => state.auth)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })

    const handleOnChange = (e) => {
        setFormData( (prevData) => (
            {
                ...prevData, 
                [e.target.name] : e.target.value
            }
        ))
    }

    const {password, confirmPassword} = formData;

    const dispatch = useDispatch();
    const location = useLocation();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);     //^ extracting token from params of sent url in mail
        dispatch(resetPassword(password, confirmPassword, token))

    }


    return (
        <div>
            {loading ? (
                <div>Loading ...</div>
            ) : (
                <div>
                    <h1>Choose New Password</h1>
                    <p>Almost done. Enter your new password and you are all set</p>
                    <form className="text-richblack-5" onSubmit={handleOnSubmit}>
                        <label>
                            <p>New Password*</p>
                            <input
                                className="w-full text-richblack-700 px-2"
                                required
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={handleOnChange}
                                placeholder="Password"
                            />
                            <span onClick={() => setShowPassword((prev) => !prev)}>
                                {" "}
                                {showPassword ? (
                                    <FaEyeSlash fontSize={24} />
                                ) : (
                                    <FaEye fontSize={24} />
                                )}{" "}
                            </span>
                        </label>

                        <label>
                            <p>Confirm New Password</p>
                            <input className="w-full text-richblack-700 px-2"
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleOnChange}
                                placeholder="Confirm Password"
                            />
                            <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                {" "}
                                {showConfirmPassword ? (
                                    <FaEyeSlash fontSize={24} />
                                ) : (
                                    <FaEye fontSize={24} />
                                )}{" "}
                            </span>
                        </label>

                        <button type="Submit">Reset Password</button>

                        <div>
                            <Link to="/login">
                                <p>Back to Login</p>
                            </Link>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UpdatePassword;