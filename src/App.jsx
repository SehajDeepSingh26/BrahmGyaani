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
import Settings from "./components/Core/Dashboard/settings"

function App() {

    return (
        <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />

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

                    <Route path="dashboard/my-profile" element={ <MyProfile />} />

                    <Route path="dashboard/enrolled-courses" element={ <EnrolledCourses />} />

                    <Route path="dashboard/purchase-history" element={ <PurchaseHistory />} />
                    
                    <Route path="dashboard/settings" element={ <Settings />} />

                </Route>


                <Route path="*" element={
                    <Error />
                } />
            </Routes>
        </div>
    )
}

export default App
