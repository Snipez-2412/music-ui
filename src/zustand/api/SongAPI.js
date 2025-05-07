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
 * Add a new song with optional image and audio file
 * @param {Object} songData - The song metadata
 * @param {File|null} coverFile - Optional cover image file
 * @param {File} audioFile - Required audio file
 * @returns {Promise<Object>} The created song
 */
export const addSong = async (songData, coverFile, audioFile) => {
  const formData = new FormData();

  formData.append(
    "song",
    new Blob([JSON.stringify(songData)], {
      type: "application/json",
    })
  );
  if (coverFile) {
    formData.append("cover", coverFile);
  }
  if (audioFile) {
    formData.append("audio", audioFile);
  }

  console.log("FormData:", formData.get("song"), formData.get("cover"), formData.get("audio"));

  const res = await fetch(BASE_URL, {
    method: "POST",
    body: formData, 
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to add song");
  return res.json();
};

/**
 * Update an existing song with optional image and audio file
 * @param {Object} songData - The song metadata
 * @param {File|null} coverFile - Optional cover image file
 * @param {File|null} audioFile - Optional audio file
 * @returns {Promise<Object>} The updated song
 */
export const updateSong = async (songData, coverFile, audioFile) => {
  const formData = new FormData();
  formData.append(
    "song",
    new Blob([JSON.stringify(songData)], {
      type: "application/json",
    })
  );
  if (coverFile) {
    formData.append("cover", coverFile);
  }
  if (audioFile) {
    formData.append("audio", audioFile);
  }

  console.log("FormData for update:", formData.get("song"), formData.get("cover"), formData.get("audio"));

  const res = await fetch(`${BASE_URL}`, {
    method: "PUT", 
    body: formData,
    credentials: "include",
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
