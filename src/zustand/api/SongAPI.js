const BASE_URL = "http://localhost:8080/songs";

/**
 * Fetch all songs
 * @returns {Promise<Array>} List of songs
 */
export const fetchSongs = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch songs");
  return res.json();
};

/**
 * Fetch a song by its ID
 * @param {number} id
 * @returns {Promise<Object>} Song object
 */
export const fetchSongById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch song");
  return res.json();
};

/**
 * Search songs with criteria (e.g. albumId, title, etc.)
 * @param {Object} criteria - Query object (e.g. { albumId: 1 })
 * @returns {Promise<Array>} Filtered song list
 */
export const searchSongs = async (criteria = {}) => {
  const params = new URLSearchParams(criteria).toString();
  const res = await fetch(`${BASE_URL}/search?${params}`);
  if (!res.ok) throw new Error("Failed to search songs");
  return res.json();
};

/**
 * Fetch songs by album ID
 * @param {number} albumId
 * @returns {Promise<Array>} List of songs for the specified album
 */
export const fetchSongsByAlbumId = async (albumId) => {
  const res = await fetch(`${BASE_URL}/search?albumId.equals=${albumId}`);
  if (!res.ok) throw new Error("Failed to fetch songs for the album");
  return res.json();
};

/**
 * Add a new song with optional image
 * @param {Object} song - The song metadata
 * @param {File|null} image - Optional image file
 * @returns {Promise<Object>} The created song
 */
export const addSong = async (song, image = null) => {
  const formData = new FormData();
  formData.append("song", new Blob([JSON.stringify(song)], { type: "application/json" }));
  if (image) {
    formData.append("image", image);
  }

  const res = await fetch(BASE_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to add song");
  return res.json();
};

/**
 * Update a song
 * @param {number} id - Song ID
 * @param {Object} song - The updated song data
 * @returns {Promise<Object>} The updated song
 */
export const updateSong = async (id, song) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(song),
  });

  if (!res.ok) throw new Error("Failed to update song");
  return res.json();
};

/**
 * Delete a song
 * @param {number} id - Song ID
 * @returns {Promise<void>}
 */
export const deleteSong = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete song");
};
