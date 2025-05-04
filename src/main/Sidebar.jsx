import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import libraryIcon from "../assets/library_icon.png";
import Playlist from "./Playlist";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { usePlaylistStore } from "../zustand/store/PlaylistStore";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredPlaylist, setHoveredPlaylist] = useState(null);

  const playlists = usePlaylistStore((state) => state.playlists);
  
  const loadPlaylists = usePlaylistStore((state) => state.loadPlaylists);

  const navigate = useNavigate();

  useEffect(() => {
    // Tải playlists khi component được render lần đầu
    loadPlaylists();
  }, [loadPlaylists]);

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

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="library">
        <div className="options">
          <div className="lib-option nav-option" onClick={toggleSidebar}>
            <img src={libraryIcon} alt="library_icon" />
            {!isCollapsed && <a href="#">Your library</a>}
          </div>
          <div className="icons">
            <i className="fa-solid fa-plus" onClick={handleCreatePlaylist}></i>
          </div>
        </div>

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
      </div>
    </div>
  );
}

export default Sidebar;
