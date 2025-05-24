import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import libraryIcon from "../assets/library_icon.png";
import likedIcon from "../assets/liked.jpg";
import Playlist from "./Playlist";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { usePlaylistStore } from "../zustand/store/PlaylistStore";
import { useUserStore } from "../zustand/store/UserStore";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredPlaylist, setHoveredPlaylist] = useState(null);

  const playlists = usePlaylistStore((state) => state.playlists);
  const loadPlaylists = usePlaylistStore((state) => state.loadPlaylists);
  const currentUser = useUserStore((state) => state.currentUser);

  const navigate = useNavigate();

    useEffect(() => {
    if (currentUser?.userID) {
      loadPlaylists(currentUser.userID);
    }
  }, [currentUser?.userID, loadPlaylists]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const goToPlaylist = (id) => {
    console.log(`Navigating to playlist ${id}`);
    navigate(`/playlist/${id}`);
  };

  const handleCreatePlaylist = () => {
    navigate("/create-playlist");
  };

  const goToLikedSongs = () => {
    navigate("/liked-page");
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="library">
        <div className="options">
          <div className="lib-option nav-option" onClick={toggleSidebar}>
            <img src={libraryIcon} alt="library_icon" />
            {!isCollapsed && <a href="#">Your library</a>}
          </div>
          {currentUser && (
            <div className="icons">
              <i className="fa-solid fa-plus" onClick={handleCreatePlaylist}></i>
            </div>
          )}
        </div>

        {/* Liked Playlist Section */}
        {currentUser && (
          <div className="liked-playlist" onClick={goToLikedSongs}>
            <img
              src={likedIcon}
              alt="Liked Songs"
              className="liked-playlist-image"
            />
            {!isCollapsed && <span>Liked Songs</span>}
          </div>
        )}

        {/* Playlists Section */}
        {currentUser ? (
          <div className="playlists">
            {playlists.length > 0 ? (
              playlists.map((playlist, index) => (
                <Playlist
                  key={playlist.playlistID}
                  playlist={playlist}
                  index={index}
                  isCollapsed={isCollapsed}
                  isHovered={hoveredPlaylist === index}
                  onHover={() => setHoveredPlaylist(index)}
                  onLeave={() => setHoveredPlaylist(null)}
                  onClick={goToPlaylist}
                />
              ))
            ) : (
              <p>Loading playlists...</p>
            )}
          </div>
        ) : (
          <p>Please log in to view your playlists.</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
