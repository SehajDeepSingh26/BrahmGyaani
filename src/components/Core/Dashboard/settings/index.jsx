import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture.jsx'
import EditProfile from './EditProfile.jsx'
import UpdatePassword from './UpdatePassword.jsx'
import DeleteAccount from './DeleteAccount.jsx'

const Settings = () => {
  return (
    <div>
      <h1>Edit Profile</h1>
      
        <UpdatePassword/>
        <EditProfile/>
        <ChangeProfilePicture/>
        <DeleteAccount/>

      
    </div>
  )
}

export default Settings
