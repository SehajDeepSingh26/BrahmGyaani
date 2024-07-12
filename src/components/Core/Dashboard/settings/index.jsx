import DeleteAccount from "./DeleteAccount"
import {ChangeProfilePicture} from "./ChangeProfilePicture"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

const Settings = () => {
    return (
        <>
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">
                Edit Profile
            </h1>
            
            <ChangeProfilePicture />

            <EditProfile />

            <UpdatePassword />

            <DeleteAccount />
        </>
    )
}

export default Settings