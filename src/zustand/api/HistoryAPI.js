const API_BASE = "http://localhost:8080/history";

export const addToHistory = async (songId) => {
  try {
    const response = await fetch(`${API_BASE}/add/songId/${songId}`, {
      method: "POST",
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error("Failed to add song to history");
    }
  } catch (error) {
    console.error("Error adding song to history:", error);
    throw error;
  }
};

export const getRecentSongs = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE}/songs?limit=${limit}`, {
      method: "GET",
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recent songs");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recent songs:", error);
    throw error;
  }
};

export const getRecentAlbums = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE}/albums?limit=${limit}`, {
      method: "GET",
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recent albums");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recent albums:", error);
    throw error;
  }
};

export const getRecentArtists = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE}/artists?limit=${limit}`, {
      method: "GET",
      credentials: "include", // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recent artists");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recent artists:", error);
    throw error;
  }
};