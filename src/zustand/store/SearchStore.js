// stores/useSearchStore.js
import { create } from "zustand";
import { searchAll } from "../api/SearchAPI";

export const useSearchStore = create((set) => ({
  query: "",
  results: [],
  loading: false,
  error: null,

  search: async (query) => {
    set({ loading: true, error: null, query });

    try {
      const results = await searchAll(query);
      console.log("Search results:", results);
      set({ results, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        loading: false,
      });
    }
  },

  clear: () => set({ query: "", results: [], error: null }),
}));
