import React from "react";
import { Link } from "react-router-dom";

function Playlist({ playlist, isCollapsed, isHovered, onHover, onLeave }) {
  return (
    <Link to={`/playlist/${(playlist.name)}`} className="playlist-link">
      <div
        className="playlist"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <img
          src={playlist.signedCoverUrl || songPicture}
          className="playlist-img"
          alt="playlist cover"
        />
        {!isCollapsed && (
          <div className="playlist-info">
            <p className="playlist-title">{playlist.name}</p>
            <p className="playlist-subtitle">Playlist • {playlist.createdByUsername}</p>
          </div>
        )}
        {isCollapsed && isHovered && (
          <div className="playlist-tooltip">
            <p className="playlist-title">{playlist.name}</p>
            <p className="playlist-subtitle">Playlist • {playlist.createdByUsername}</p>
          </div>
        )}
      </div>
    </Link>
  );
}

export default Playlist;
