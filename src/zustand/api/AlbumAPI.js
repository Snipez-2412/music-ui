import { AlbumType } from "../types/Album";

/** @type {string} */
const BASE_URL = "http://localhost:8080/albums";

/**
 * Fetch all albums
 * @returns {Promise<Album[]>}
 */
export const fetchAlbums = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch albums");
  return response.json();
};

/**
 * Fetch album by ID
 * @param {number} id
 * @returns {Promise<Album>}
 */
export const fetchAlbumById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch album");
  return response.json();
};

/**
 * Fetch album by title
 * @param {string} title
 * @returns {Promise<Album>}
 */
export const fetchAlbumByTitle = async (title) => {
  const response = await fetch(`${BASE_URL}/search?title.equals=${encodeURIComponent(title)}`);
  if (!response.ok) throw new Error("Failed to fetch album by title");
  const data = await response.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
};

/**
 * Add a new album
 * @param {Album} album
 * @returns {Promise<Album>}
 */
export const addAlbum = async (album, coverImage) => {
  const formData = new FormData();
  formData.append(
    "album",
    new Blob([JSON.stringify(album)], {
      type: "application/json",
    })
  );
  formData.append("image", coverImage);

  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to add album");
  return response.json();
};

/**
 * Update an existing album
 * @param {Album} album
 * @returns {Promise<Album>}
 */
export const updateAlbum = async (album) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(album),
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to update album");
  
  // Return the updated album response
  return response.json();
};


/**
 * Delete an album by ID
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteAlbum = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete album");
};


