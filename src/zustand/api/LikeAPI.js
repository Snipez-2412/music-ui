const API_BASE = "http://localhost:8080/likes";

export const getLikedSongs = async (userId) => {
  const res = await fetch(`${API_BASE}/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch liked songs");
  return await res.json();
};

export const likeSong = async (userId, songId) => {
  const res = await fetch(`${API_BASE}/like/user/${userId}/song/${songId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.text();
};

export const unlikeSong = async (userId, songId) => {
  const res = await fetch(`${API_BASE}/unlike/user/${userId}/songs/${songId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.text();
};
