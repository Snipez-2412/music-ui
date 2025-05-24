const BASE_URL = "http://localhost:8080/recommend";

/**
 * Fetch recommended songs by song ID
 * @param {number} songId - The ID of the song to base recommendations on
 * @param {number} topK - The number of recommendations to fetch
 * @returns {Promise<Array>} - A list of recommended songs
 */
export const fetchRecommendationsBySongId = async (songId, topK = 2) => {
  const response = await fetch(`${BASE_URL}/lyrics/songId/${songId}?topK=${topK}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }
  return response.json();
};

/**
 * Fetch recommended albums by song ID
 * @param {number} songId - The ID of the song to base recommendations on
 * @param {number} topK - The number of recommendations to fetch
 * @returns {Promise<Array>} - A list of recommended albums
 */
export const fetchRecommendedAlbumsBySongId = async (songId, topK = 5) => {
  const response = await fetch(`${BASE_URL}/albums/songId/${songId}?topK=${topK}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recommended albums");
  }
  return response.json();
};