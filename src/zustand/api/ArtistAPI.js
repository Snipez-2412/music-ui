const BASE_URL = "http://localhost:8080/artists";

export const fetchAllArtists = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch artists");
  return res.json();
};

export const fetchArtistById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch artist");
  return res.json();
};

export const searchArtists = async (criteria) => {
  const params = new URLSearchParams(criteria).toString();
  const res = await fetch(`${BASE_URL}/search?${params}`);
  if (!res.ok) throw new Error("Failed to search artists");
  return res.json();
};

export const addArtist = async (artist, imageFile) => {
  const formData = new FormData();
  formData.append("artist", 
    new Blob([JSON.stringify(artist)], { type: "application/json" }
  ));
  if (imageFile) formData.append("image", imageFile);
  console.log("Artist payload being sent:", artist); 

  const res = await fetch(BASE_URL, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to add artist");
  return res.json();
};

export const updateArtist = async (artist, imageFile) => {
  const formData = new FormData();
  formData.append("artist", 
    new Blob([JSON.stringify(artist)], { type: "application/json" }
  ));
  if (imageFile) formData.append("image", imageFile);

  const res = await fetch(BASE_URL, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update artist");
  return res.json();
};

export const deleteArtist = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete artist");
};
