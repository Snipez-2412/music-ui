// apis/lyricsApi.js
const API_BASE = "http://localhost:8080/lyrics";

export const fetchLyrics = async (songId) => {
  const res = await fetch(`${API_BASE}/${songId}`);
  if (!res.ok) throw new Error("Lyrics not found");
  return await res.json();
};

export const addLyrics = async (songId, content) => {
  const res = await fetch(`${API_BASE}/add/${songId}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(content),
  });
  if (!res.ok) throw new Error("Failed to add lyrics");
  return await res.json();
};

export const updateLyrics = async (songId, newContent) => {
  const res = await fetch(`${API_BASE}/update/${songId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(newContent),
  });
  if (!res.ok) throw new Error("Failed to update lyrics");
  return await res.json();
};

export const deleteLyrics = async (songId) => {
  const res = await fetch(`${API_BASE}/delete/${songId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete lyrics");
};
