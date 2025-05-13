import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useUserStore } from '../zustand/store/UserStore';
import { usePlaylistStore } from '../zustand/store/PlaylistStore';
import Card from '../main/Card';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { id } = useParams();
  const { currentUser, updateUser } = useUserStore((state) => ({
    currentUser: state.currentUser,
    updateUser: state.updateUser,
  }));

  const { playlists, loadPlaylists, loading: playlistsLoading } = usePlaylistStore((state) => ({
    playlists: state.playlists,
    loadPlaylists: state.loadPlaylists,
    loading: state.loading,
  }));

  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    profilePic: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  

  // Memoize the loadPlaylists callback
  const loadUserPlaylists = useCallback(async () => {
    try {
      if (currentUser?.userID) {
        await loadPlaylists(currentUser.userID);
      }
    } catch (err) {
      setError('Failed to load playlists');
      console.error('Error loading playlists:', err);
    }
  }, [currentUser?.userID, loadPlaylists]);

  useEffect(() => {
    console.log("Current User in UserProfile:", currentUser);
  }, [currentUser]);

  // Load playlists when user ID changes
  useEffect(() => {
    loadUserPlaylists();
  }, [loadUserPlaylists]);

  // Memoize the user details update
  const updateUserDetails = useCallback(() => {
    if (currentUser && !isEditing) {
      const newDetails = {
        username: currentUser.username || '',
        email: currentUser.email || '',
        profilePic: currentUser.profilePicUrl || null,
      };
      
      // Only update if the details have changed
      if (JSON.stringify(userDetails) !== JSON.stringify(newDetails)) {
        setUserDetails(newDetails);
      }
    }
  }, [currentUser, isEditing, userDetails]);

  // Update user details only when not editing
  useEffect(() => {
    updateUserDetails();
  }, [updateUserDetails]);

  const handleProfileChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePic') {
      setUserDetails((prev) => ({ ...prev, profilePic: files[0] }));
    } else {
      setUserDetails((prev) => ({ ...prev, [name]: value }));
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

  // Memoize the playlist cards
  const playlistCards = useMemo(() => {
    if (playlistsLoading) {
      return <p>Loading playlists...</p>;
    }
    
    if (playlists.length === 0) {
      return <p>No playlists found</p>;
    }
    
    return playlists.map((playlist) => (
      <Card
        key={playlist.playlistID}
        image={playlist.signedCoverUrl}
        title={playlist.name}
        info={`${playlist.songCount || 0} songs`}
        type="playlist"
      />
    ));
  }, [playlists, playlistsLoading]);

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
                disabled={isSaving}
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

      <div className="user-playlists">
        <h2>Your Playlists</h2>
        <div className="playlists-grid">
          {playlistCards}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
