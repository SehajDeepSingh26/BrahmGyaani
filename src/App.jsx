import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
// import "./App.css"
import Navbar from "./components/Common/Navbar"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import OpenRoute from "./components/Core/auth/OpenRoute"
import ForgotPassword from "./pages/ForgotPassword"
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail"
import Dashboard from "./pages/Dashboard"
import MyProfile from "./components/Core/Dashboard/MyProfile"
import PrivateRoute from "./components/Core/auth/PrivateRoute"
import Error from "./pages/Error"
import EnrolledCourses from "./components/Core/Dashboard/EnrolledCourses"
import PurchaseHistory from "./components/Core/Dashboard/PurchaseHistory"
import Settings from "./components/Core/Dashboard/settings/Index"
import Cart from "./components/Core/Dashboard/Cart"
import { useSelector } from "react-redux"
import AddCourse from "./components/Core/Dashboard/AddCourse"
import toast from "react-hot-toast"
import MyCourses from "./components/Core/Dashboard/MyCourses"
import EditCourse from "./components/Core/Dashboard/EditCourse"
import Catalog from "./pages/Catalog"

function App() {
    const {user} = useSelector((state) => state.profile)

    //^ Session TimeOut
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');
    if(now-setupTime > 2*60*60*1000 && localStorage.getItem("token") !== null) {
        localStorage.clear()
        toast.error("Session Timeed Out, Please Login Again !!")
        
        location.reload(true);
    }
    
    
    return (
        <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/catalog/:catalogName" element={<Catalog />} />

                <Route
                    path="signup" element={
                        <OpenRoute>
                            <Signup />
                        </OpenRoute>}
                />
                <Route
                    path="login"
                    element={
                        <OpenRoute>
                            <Login />
                        </OpenRoute>}
                />
                <Route
                    path="forgot-password"
                    element={
                        <OpenRoute>
                            <ForgotPassword />
                        </OpenRoute>}
                />
                <Route
                    path="update-password/:id"
                    element={
                        <OpenRoute>
                            <UpdatePassword />
                        </OpenRoute>}
                />
                <Route
                    path="verify-email/"
                    element={
                        <OpenRoute>
                            <VerifyEmail />
                        </OpenRoute>}
                />

                <Route element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } >

                    <Route path="dashboard/my-profile" element={<MyProfile />} />

                    <Route path="dashboard/settings" element={<Settings />} />

                    {
                        user?.accountType === "Student" && (
                            <>
                                <Route path="dashboard/cart" element={<Cart />} />

                                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />

                                <Route path="dashboard/purchase-history" element={<PurchaseHistory />} />
                            </>
                        )
                    }
                    {
                        user?.accountType === "Instructor" && (
                            <>
                                <Route path="dashboard/add-course" element={<AddCourse />} />

                                <Route path="dashboard/my-courses" element={<MyCourses />} />
                                <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
                            </>
                        )
                    }

                </Route>


                <Route path="*" element={
                    <Error />
                } />
            </Routes>
        </div>
    )
}

export default App
