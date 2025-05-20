const BASE_URL = "http://localhost:8080/playlists";

/**
 * Fetch playlists created by the currently logged-in user
 * @returns {Promise<Array>} List of user's playlists
 */
export const fetchPlaylists = async () => {
  const res = await fetch(BASE_URL, {
    method: "GET",
    credentials: 'include', 
  });

  if (!res.ok) throw new Error("Failed to fetch playlists");
  return res.json();
};

/**
 * Fetch a playlist by ID
 * @param {number} id
 * @returns {Promise<Object>} Playlist object
 */
export const fetchPlaylistById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    credentials: 'include',
  });

  if (!res.ok) throw new Error("Failed to fetch playlist");
  return res.json();
};

/**
 * Search playlists using query criteria
 * @param {Object} criteria - (e.g., { name: 'Chill', description: 'lofi' })
 * @returns {Promise<Array>} Filtered playlist list
 */
export const searchPlaylists = async (criteria = {}) => {
  const params = new URLSearchParams(criteria).toString();
  const res = await fetch(`${BASE_URL}/search?${params}`, {
    method: "GET",
    credentials: 'include', 
  });

  if (!res.ok) throw new Error("Failed to search playlists");
  return res.json();
};

/**
 * Get playlist by name (uses search under the hood)
 * @param {string} name
 * @returns {Promise<Object|null>}
 */
export const fetchPlaylistByName = async (name) => {
  const res = await fetch(
    `${BASE_URL}/search?name.equals=${encodeURIComponent(name)}`,
    {
      method: "GET",
      credentials: 'include', 
    }
  );

  if (!res.ok) throw new Error("Failed to fetch playlist by name");
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
};

/**
 * Add a new playlist (user ID is set in backend)
 * @param {Object} playlist - { name, description, songIds }
 * @param {File|null} image
 * @returns {Promise<Object>}
 */
export const addPlaylist = async (playlist, image = null) => {
  const formData = new FormData();

  const playlistPayload = {
    name: playlist.name,
    description: playlist.description,
    songIds: playlist.songIds || [],
  };

  formData.append(
    "playlist",
    new Blob([JSON.stringify(playlistPayload)], {
      type: "application/json",
    })
  );

  if (image) {
    formData.append("image", image);
  }

  const res = await fetch(BASE_URL, {
    method: "POST",
    credentials: 'include', 
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to add playlist");
  return res.json();
};

/**
 * Update a playlist
 * @param {number} id
 * @param {Object} playlist
 * @returns {Promise<Object>}
 */
export const updatePlaylist = async (id, playlist, image = null) => {
  const formData = new FormData();

  const playlistPayload = {
    name: playlist.name,
    description: playlist.description,
  };

  formData.append(
    "playlist",
    new Blob([JSON.stringify(playlistPayload)], {
      type: "application/json",
    })
  );

  if (image) {
    formData.append("image", image);
  }

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    credentials: 'include', 
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to update playlist");
  return res.json();
};

/**
 * Delete a playlist
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deletePlaylist = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      // No token needed here as the session will handle authentication
    },
    credentials: 'include', // Ensures that cookies/session are included in the request
  });

  if (!res.ok) throw new Error("Failed to delete playlist");
};
