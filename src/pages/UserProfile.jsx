import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserStore } from '../zustand/store/UserStore';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const { currentUser, fetchUser, updateUser } = useUserStore((state) => ({
    currentUser: state.currentUser,
    fetchUser: state.fetchUser,
    updateUser: state.updateUser,
  }));

  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    profilePic: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data when the component mounts
    if (id) {
      fetchUser(id);
    }
  }, [id, fetchUser]);

  useEffect(() => {
    // Set user details when currentUser is fetched
    if (currentUser) {
      setUserDetails({
        username: currentUser.username,
        email: currentUser.email,
        profilePic: currentUser.profilePicUrl || null,
      });
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setUserDetails((prev) => ({ ...prev, profilePic: files[0] }));
    } else {
      setUserDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (currentUser) {
      await updateUser(id, userDetails, userDetails.profilePic);
      setIsEditing(false);
    }
  };

  if (!currentUser) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div className="user-profile-page">
      <h1>User Profile</h1>
      <div className="user-profile-info">
        <div className="profile-picture">
          <img
            src={userDetails.profilePic || '/default-profile-pic.png'}
            alt={currentUser.username}
            className="profile-image"
          />
        </div>
        <div className="profile-details">
          <div className="profile-field">
            <label>Username:</label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={userDetails.username}
                onChange={handleProfileChange}
              />
            ) : (
              <p>{userDetails.username}</p>
            )}
          </div>
          <div className="profile-field">
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userDetails.email}
                onChange={handleProfileChange}
              />
            ) : (
              <p>{userDetails.email}</p>
            )}
          </div>
          <div className="profile-field">
            {isEditing && (
              <>
                <label>Profile Picture:</label>
                <input
                  type="file"
                  name="profilePic"
                  onChange={handleProfileChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {isEditing ? (
        <button onClick={handleSave}>Save Changes</button>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      )}
    </div>
  );
};

export default UserProfilePage;
