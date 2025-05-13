import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useUserStore } from '../zustand/store/UserStore';
import { Avatar } from 'antd';
import './UserProfilePage.css';

const UserProfilePage = () => {  
  const { id } = useParams();
  
  // More specific selector to prevent unnecessary re-renders
  const currentUser = useUserStore(useCallback(state => state.currentUser, []));
  const updateUser = useUserStore(useCallback(state => state.updateUser, []));

  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    profilePic: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const memoizedUserDetails = useMemo(() => {
    if (!currentUser) return null;
    return {
      username: currentUser.username || '',
      email: currentUser.email || '',
      profilePic: currentUser.signedProfileUrl || null,
    };
  }, [currentUser?.username, currentUser?.email, currentUser?.signedProfileUrl]);

  // Load user details when memoized details change
  useEffect(() => {
    if (memoizedUserDetails && JSON.stringify(memoizedUserDetails) !== JSON.stringify(userDetails)) {
      setUserDetails(memoizedUserDetails);
    }
  }, [memoizedUserDetails]);

  const profilePicUrl = useMemo(() => {
    if (userDetails.profilePic instanceof File) {
      return URL.createObjectURL(userDetails.profilePic);
    }
    return userDetails.profilePic || '/default-profile-pic.png';
  }, [userDetails.profilePic]);

  const handleProfileChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      const file = files[0];
      if (file) {
        setUserDetails((prev) => ({ ...prev, profilePic: file }));
      }
    } else {
      setUserDetails((prev) => {
        if (prev[name] !== value) {
          return { ...prev, [name]: value };
        }
        return prev;
      });
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!currentUser) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateUser(id, userDetails, userDetails.profilePic);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  }, [currentUser, id, updateUser, userDetails]);

  if (!currentUser) {
    return <div className="loading-container">Loading user profile...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="user-profile-page">
      <div className="user-profile-header">
        <div className="profile-picture">
          <Avatar
            size={120}
            src={profilePicUrl}
          />
        </div>
        <div className="profile-details">
          <div className="profile-field">
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={userDetails.username}
                onChange={handleProfileChange}
                disabled={isSaving}
              />
            ) : (
              <h3>{userDetails.username}</h3>
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
                disabled={isSaving}
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
                  disabled={isSaving}
                />
              </>
            )}
          </div>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="save-button"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="edit-button"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
