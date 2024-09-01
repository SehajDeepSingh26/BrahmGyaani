import DeleteAccount from "./DeleteAccount"
import {ChangeProfilePicture} from "./ChangeProfilePicture"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

const Settings = () => {
    return (
        <div className="ml-32">
            <h1 className="mb-8 mt-5 text-3xl font-bold text-richblack-5">
                Edit Profile
            </h1>
            
            <ChangeProfilePicture />

            <EditProfile />

            <UpdatePassword />

            <DeleteAccount />
        </div>
    )
}

export default Settings