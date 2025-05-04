import { create } from "zustand";
import * as playlistSongAPI from "../api/PlaylistSongAPI";

export const usePlaylistSongStore = create((set) => ({
  playlistSongs: [],
  loading: false,
  error: null,

  // Fetch songs in a specific playlist
  loadSongsInPlaylist: async (playlistId) => {
    set({ loading: true, error: null });
    try {
      const data = await playlistSongAPI.fetchSongsInPlaylist(playlistId);
      set({ playlistSongs: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add a song to a playlist
  addSongToPlaylist: async (playlistId, songId) => {
    set({ loading: true, error: null });
    try {
      const newSong = await playlistSongAPI.addSongToPlaylist(playlistId, songId);
      set((state) => ({
        playlistSongs: [...state.playlistSongs, newSong],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Remove a song from a playlist
  removeSongFromPlaylist: async (playlistId, songId) => {
    set({ loading: true, error: null });
    try {
      await playlistSongAPI.removeSongFromPlaylist(playlistId, songId);
      set((state) => ({
        playlistSongs: state.playlistSongs.filter((song) => song.songId !== songId),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
