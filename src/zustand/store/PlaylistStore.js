import { create } from "zustand";
import * as playlistAPI from "../api/PlaylistAPI";

export const usePlaylistStore = create((set, get) => ({
  playlists: [],
  selectedPlaylist: null,
  loading: false,
  error: null,

  loadPlaylists: async (userId) => {
    if (!userId) return;
    
    set({ loading: true, error: null });
    try {
      const data = await playlistAPI.fetchPlaylists(userId);
      set({ playlists: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  loadPlaylistByName: async (name) => {
    set({ loading: true, error: null });
    try {
      const data = await playlistAPI.fetchPlaylistByName(name);
      set({ selectedPlaylist: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Lấy 1 playlist theo ID
  loadPlaylistById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await playlistAPI.fetchPlaylistById(id);
      set({ selectedPlaylist: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Tìm playlist theo điều kiện (tên, mô tả, v.v.)
  searchPlaylists: async (criteria) => {
    set({ loading: true, error: null });
    try {
      const results = await playlistAPI.searchPlaylists(criteria);
      set({ playlists: results, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Tạo mới playlist (có thể có ảnh hoặc không)
  createPlaylist: async (playlist, image) => {
    set({ loading: true, error: null });
    try {
      // Get the current user from UserStore
      const currentUser = useUserStore.getState().currentUser;

      if (!currentUser || !currentUser.userID) {
        throw new Error("Failed to retrieve current user or user ID");
      }

      console.log("User ID:", currentUser.userID);
      console.log("Playlist data:", playlist);

      // Add userId to the playlist payload
      const playlistWithUserId = {
        ...playlist,
        userId: currentUser.userID, // Add userId to the payload
      };

      // Call the API to create the playlist
      const newPlaylist = await playlistAPI.addPlaylist(playlistWithUserId, image);
      set((state) => ({
        playlists: [...state.playlists, newPlaylist], // Add the new playlist to the store
        loading: false,
      }));
      return true; // Indicate success
    } catch (error) {
      console.error("Error creating playlist:", error);
      set({ error: error.message, loading: false });
      return false; // Indicate failure
    }
  },

  // Cập nhật playlist
  updatePlaylist: async (id, playlist) => {
    set({ loading: true, error: null });
    try {
      const updated = await playlistAPI.updatePlaylist(id, playlist);
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p.playlistID === id ? updated : p
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Xoá playlist
  deletePlaylist: async (id) => {
    set({ loading: true, error: null });
    try {
      await playlistAPI.deletePlaylist(id);
      set((state) => ({
        playlists: state.playlists.filter((p) => p.playlistID !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Xoá playlist đang được chọn (nếu có)
  clearSelectedPlaylist: () => {
    set({ selectedPlaylist: null });
  },
}));

