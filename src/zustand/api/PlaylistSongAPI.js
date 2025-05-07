const BASE_URL = "http://localhost:8080/playlist-songs";

/**
 * Fetch songs in a specific playlist
 * @param {number} playlistId - The ID of the playlist
 * @returns {Promise<Array>} List of PlaylistSongDTOs
 */
export const fetchSongsInPlaylist = async (playlistId) => {
  const res = await fetch(`${BASE_URL}/${playlistId}`, {
    method: "GET",
    credentials: 'include',
  });

  if (!res.ok) throw new Error("Failed to fetch songs in playlist");
  return res.json();
};

/**
 * Add a song to a playlist
 * @param {number} playlistId - The ID of the playlist
 * @param {number} songId - The ID of the song
 * @returns {Promise<Object>} The PlaylistSongDTO object that was added
 */
export const addSongToPlaylist = async (playlistId, songId) => {
  const res = await fetch(`${BASE_URL}/${playlistId}/song/${songId}`, {
    method: "POST",
    headers: {
      // No token needed, as session handles authentication
    },
    credentials: 'include', // Ensures that cookies/session are included in the request
  });

  if (!res.ok) throw new Error("Failed to add song to playlist");
  return res.json();
};

/**
 * Remove a song from a playlist
 * @param {number} playlistId - The ID of the playlist
 * @param {number} songId - The ID of the song
 * @returns {Promise<void>}
 */
export const removeSongFromPlaylist = async (playlistId, songId) => {
  const res = await fetch(`${BASE_URL}/${playlistId}/song/${songId}`, {
    method: "DELETE",
    headers: {
      // No token needed, as session handles authentication
    },
    credentials: 'include', // Ensures that cookies/session are included in the request
  });

  if (!res.ok) throw new Error("Failed to remove song from playlist");
};
