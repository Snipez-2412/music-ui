const BASE_URL = "http://localhost:8080/search";

export async function searchAll(query) {
    const res = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error("Failed to fetch search results");
    }
    return res.json();
  }
  