// src/zustand/store/artistStore.js
import { create } from "zustand";
import * as artistAPI from "../api/ArtistAPI";

const useArtistStore = create((set) => ({
  artists: [],
  currentArtist: null,

  fetchAllArtists: async () => {
    try {
      const data = await artistAPI.fetchAllArtists();
      set({ artists: data });
    } catch (error) {
      console.error("Failed to fetch artists:", error);
    }
  },

  fetchArtist: async (id) => {
    try {
      const data = await artistAPI.fetchArtistById(id);
      set({ currentArtist: data });
    } catch (error) {
      console.error("Failed to fetch artist:", error);
    }
  },

  searchArtists: async (criteria) => {
    try {
      const results = await artistAPI.searchArtists(criteria);
      set({ artists: results });
    } catch (error) {
      console.error("Failed to search artists:", error);
    }
  },

  createArtist: async (artist, imageFile) => {
    try {
      const newArtist = await artistAPI.addArtist(artist, imageFile);
      set((state) => ({ artists: [...state.artists, newArtist] }));
    } catch (error) {
      console.error("Failed to create artist:", error);
    }
  },

  updateArtist: async (artist) => {
    try {
      const updated = await artistAPI.updateArtist(artist);
      console.log("Updated artist:", updated); // Debug log
      set((state) => {
        const updatedArtists = state.artists.map((a) =>
          a.artistID === updated.artistID ? updated : a 
        );
        return {
          artists: updatedArtists,
          currentArtist: updated,
        };
      });
    } catch (error) {
      console.error("Failed to update artist:", error);
    }
  },

  deleteArtist: async (id) => {
    try {
      await artistAPI.deleteArtist(id);
      set((state) => ({
        artists: state.artists.filter((a) => a.id !== id),
        currentArtist: state.currentArtist?.id === id ? null : state.currentArtist,
      }));
    } catch (error) {
      console.error("Failed to delete artist:", error);
    }
  },
}));

export default useArtistStore;