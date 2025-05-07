import React, { useEffect, useState } from "react";
import { useLikeStore } from "../zustand/store/LikeStore";
import { useUserStore } from "../zustand/store/UserStore";
import useSongStore from "../zustand/store/SongStore";
import SongList from "./SongList";
import likedImage from "../assets/liked.jpg"; 
import "./LikedPage.css";

function LikedSongs() {
  const { likes, fetchLikes } = useLikeStore();
  const currentUser = useUserStore((state) => state.currentUser);
  const { fetchSongById } = useSongStore();
  const [likedSongs, setLikedSongs] = useState([]);

  // Fetch likes when the component mounts or when the current user changes
  useEffect(() => {
    const fetchUserLikes = async () => {
      if (currentUser?.userID) {
        await fetchLikes(currentUser.userID);
      }
    };

    fetchUserLikes();
  }, [currentUser, fetchLikes]);

  // Fetch song details whenever the `likes` array updates
  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (likes.length > 0) {
        console.log("Likes response:", likes);

        const songs = await Promise.all(
          likes.map(async (like) => {
            const song = await fetchSongById(like.songID);
            return song;
          })
        );
        setLikedSongs(songs);
      } else {
        setLikedSongs([]);
      }
    };

    fetchLikedSongs();
  }, [likes, fetchSongById]);

  if (!currentUser) {
    return <p>Please log in to view your liked songs.</p>;
  }

  return (
    <div className="liked-page">
      <div className="liked-page-info">
        <img
          src={likedImage}
          alt="Liked Songs"
          className="liked-page-image"
        />
        <div className="liked-page-details">
          <h1 className="liked-page-title">Liked Songs</h1>
          <p className="liked-page-meta">{likedSongs.length} songs</p>
        </div>
      </div>

      <div className="song-list-header">
        <span>#</span>
        <span>Title</span>
      </div>
      <hr className="divider" />

      <SongList songs={likedSongs} />
    </div>
  );
}

export default LikedSongs;