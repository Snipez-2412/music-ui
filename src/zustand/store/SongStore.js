import { create } from "zustand";
import * as songAPI from "../api/SongAPI";

const useSongStore = create((set, get) => ({
  songs: [],
  loading: false,
  error: null,

  fetchAllSongs: async () => {
    set({ loading: true, error: null });
    try {
      const songs = await songAPI.fetchSongs();
      set({ songs, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchSongById: async (id) => {
    try {
      return await songAPI.fetchSongById(id);
    } catch (error) {
      set({ error: error.message });
      return null;
    }
  },

  fetchSongsByAlbumId: async (albumId) => {
    set({ loading: true, error: null });
    try {
      const songs = await songAPI.fetchSongsByAlbumId(albumId);
      console.log("Fetched songs for album:", songs);
      set({ songs, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addSong: async (songData, coverFile, audioFile) => {
    try {
      console.log("Adding song in store:", songData, coverFile, audioFile);
      const newSong = await songAPI.addSong(songData, coverFile, audioFile);
      set((state) => ({
        songs: [...state.songs, newSong], // Add the new song to the state
      }));

      return newSong;
    } catch (error) {
      console.error("Failed to add song in store:", error);
      set({ error: error.message });
      return null;
    }
  },

  updateSong: async (songData, coverFile, audioFile) => {
    try {
      console.log("Updating song in store:", songData, coverFile, audioFile);
      const updatedSong = await songAPI.updateSong(songData, coverFile, audioFile); // Pass files to the API

      // Update the song in the state
      set((state) => {
        const updatedSongs = state.songs.map((song) =>
          song.songID === updatedSong.songID ? updatedSong : song
        );
        console.log("Updated songs in state:", updatedSongs);
        return { songs: updatedSongs };
      });

      return updatedSong; // Return the updated song
    } catch (error) {
      console.error("Failed to update song in store:", error);
      set({ error: error.message });
      return null;
    }
  },
  
  deleteSong: async (id) => {
    try {
      await songAPI.deleteSong(id);
      set({ songs: get().songs.filter((s) => s.songID !== id) });
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useSongStore;
