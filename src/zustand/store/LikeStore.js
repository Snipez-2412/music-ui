// zustand/store/LikeStore.js
import { create } from "zustand";
import {
  getLikedSongs,
  likeSong,
  unlikeSong,
} from "../api/LikeAPI";

export const useLikeStore = create((set, get) => ({
  likes: [],

  fetchLikes: async (userId) => {
    try {
      const likes = await getLikedSongs(userId);
      set({ likes });
    } catch (error) {
      console.error("Failed to fetch liked songs:", error);
    }
  },

  addLike: async (userId, songId) => {
    try {
      await likeSong(userId, songId);
      await get().fetchLikes(userId);
    } catch (error) {
      console.error("Failed to like song:", error);
    }
  },

  removeLike: async (userId, songId) => {
    try {
      await unlikeSong(userId, songId);
      await get().fetchLikes(userId);
    } catch (error) {
      console.error("Failed to unlike song:", error);
    }
  },
}));
