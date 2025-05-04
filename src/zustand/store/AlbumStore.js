import { create } from "zustand";
import * as albumAPI from "../api/AlbumAPI";

const useAlbumStore = create((set, get) => {
  const fetchAllAlbums = async () => {
    set({ loading: true, error: null });
    try {
      const albums = await albumAPI.fetchAlbums();
      set({ albums, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  };

  return {
    albums: [],
    loading: false,
    error: null,
    fetchAllAlbums,
    fetchAlbumById: async (id) => {
      try {
        return await albumAPI.fetchAlbumById(id);
      } catch (error) {
        set({ error: error.message });
        return null;
      }
    },

    fetchAlbumByTitle: async (title) => {
      try {
        return await albumAPI.fetchAlbumByTitle(title);
      } catch (error) {
        set({ error: error.message });
        return null;
      }
    },

    addAlbum: async (album) => {
      try {
        const newAlbum = await albumAPI.addAlbum(album);
        set({ albums: [...get().albums, newAlbum] });
        return newAlbum;
      } catch (error) {
        set({ error: error.message });
        return null;
      }
    },

    updateAlbum: async (album) => {
      try {
        const updatedAlbum = await albumAPI.updateAlbum(album);
        const updatedList = get().albums.map((a) =>
          a.albumID === updatedAlbum.albumID ? updatedAlbum : a
        );
        set({ albums: updatedList });
        return updatedAlbum;
      } catch (error) {
        set({ error: error.message });
        return null;
      }
    },
    
    deleteAlbum: async (id) => {
      try {
        await albumAPI.deleteAlbum(id);
        set({ albums: get().albums.filter((a) => a.albumID !== id) });
      } catch (error) {
        set({ error: error.message });
      }
    },
  };
});

export default useAlbumStore;
