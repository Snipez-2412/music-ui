import { create } from "zustand";

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
    const audioElement = audioRef?.audio?.current; // Access the actual <audio> element
    if (audioElement) {
      if (audioElement.paused) {
        audioElement.play();
        set({ isPlaying: true });
      } else {
        audioElement.pause();
        set({ isPlaying: false });
      }
    } else {
      console.error("Audio element not found or not initialized yet");
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
    const { currentSong, songs } = get();
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length; // Loop back to the start
    console.log("Next Song:", songs[nextIndex]);
    set({ currentSong: songs[nextIndex] });
  },

  previousSong: () => {
    const { currentSong, songs } = get();
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length; // Loop back to the end
    console.log("Previous Song:", songs[previousIndex]);
    set({ currentSong: songs[previousIndex] });
  },

  setCurrentSong: (song) => {
    const { songs } = get();
    const index = songs.findIndex((s) => s.songID === song.songID);
    if (index !== -1) {
      set({ currentIndex: index, currentSong: song });
      console.log("Current song set to:", song);
    } else {
      console.error("Song not found in the playlist:", song);
    }
  },

  updateSongs: (newSongs) => {
    set({ songs: newSongs });
  },

  setAudioRef: (ref) => {
    console.log("Setting audioRef in Zustand store:", ref);
    set({ audioRef: ref });
  },
}));

export default useMusicPlayerStore;