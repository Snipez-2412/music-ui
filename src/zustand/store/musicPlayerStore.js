import { create } from "zustand";
import { addToHistory } from "../api/HistoryAPI";

const useMusicPlayerStore = create((set, get) => ({
  isPlaying: false,
  shuffle: false,
  repeat: false,
  currentTime: 0,
  duration: 0,
  volume: 50,
  currentSong: null,
  songs: [],
  currentIndex: 0,
  audioRef: null,

  // Actions
  togglePlay: () => {
    const { isPlaying, audioRef } = get();
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
        set({ isPlaying: false });
      } else {
        audioRef.play().catch((error) => {
          console.error("Failed to play audio:", error);
        });
        set({ isPlaying: true });
      }
    }
  },

  toggleShuffle: () => {
    set((state) => ({ shuffle: !state.shuffle }));
  },

  toggleRepeat: () => {
    set((state) => ({ repeat: !state.repeat }));
  },

  updateTime: () => {
    const { audioRef } = get();
    set({ currentTime: audioRef?.currentTime || 0 });
  },

  seek: (newTime) => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.currentTime = newTime;
      set({ currentTime: newTime });
    }
  },

  loadMetadata: () => {
    const { audioRef } = get();
    set({ duration: audioRef?.duration || 0 });
  },

  changeVolume: (newVolume) => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.volume = newVolume / 100;
      set({ volume: newVolume });
    }
  },

  nextSong: () => {
    const { currentSong, songs, currentIndex } = get();
    if (!currentSong || songs.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % songs.length;
    const nextSong = songs[nextIndex];
    
    set({ 
      currentSong: nextSong,
      currentIndex: nextIndex,
      isPlaying: true 
    });
    
    addToHistory(nextSong.songID || nextSong.id).catch(error => {
      console.error("Failed to add song to history:", error);
    });
  },

  previousSong: () => {
    const { currentSong, songs, currentIndex } = get();
    if (!currentSong || songs.length === 0) return;
    
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    const previousSong = songs[previousIndex];
    
    set({ 
      currentSong: previousSong,
      currentIndex: previousIndex,
      isPlaying: true 
    });
    
    addToHistory(previousSong.songID || previousSong.id).catch(error => {
      console.error("Failed to add song to history:", error);
    });
  },

  setCurrentSong: async (song) => {
    if (!song) return;
    
    const { songs } = get();
    const index = songs.findIndex((s) => s.songID === song.songID || s.id === song.id);
    
    if (index !== -1) {
      set({ 
        currentIndex: index, 
        currentSong: song,
        isPlaying: true 
      });
    } else {
      set({ 
        currentSong: song,
        currentIndex: 0,
        isPlaying: true 
      });
    }

    try {
      await addToHistory(song.songID || song.id);
    } catch (error) {
      console.error("Failed to add song to history:", error);
    }
  },

  updateSongs: (newSongs) => {
    if (!newSongs || newSongs.length === 0) return;
    set({ songs: newSongs });
  },

  setAudioRef: (ref) => {
    set({ audioRef: ref });
  },

  resetPlaylist: (newSongs, songToPlay) => {
    if (!newSongs || !songToPlay) return;
    
    const index = newSongs.findIndex((song) => 
      song.id === songToPlay.id || song.songID === songToPlay.songID
    );
    
    if (index !== -1) {
      set({
        songs: newSongs,
        currentSong: songToPlay,
        currentIndex: index,
        isPlaying: true,
      });
    }
  },
}));

export default useMusicPlayerStore;