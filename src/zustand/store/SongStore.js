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

  addSong: async (song, image = null) => {
    try {
      const newSong = await songAPI.addSong(song, image);
      set({ songs: [...get().songs, newSong] });
      return newSong;
    } catch (error) {
      set({ error: error.message });
      return null;
    }
  },

  updateSong: async (id, song) => {
    try {
      const updatedSong = await songAPI.updateSong(id, song);
      const updatedList = get().songs.map((s) =>
        s.songID === updatedSong.songID ? updatedSong : s
      );
      set({ songs: updatedList });
      return updatedSong;
    } catch (error) {
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
