import { create } from "zustand";
import { addToHistory } from "../api/HistoryAPI"; // Import the History API function

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
        console.log("Paused playback");
      } else {
        audioRef.play().catch((error) => {
          console.error("Failed to play audio:", error);
        });
        set({ isPlaying: true });
        console.log("Started playback");
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
    const { currentSong, songs, setCurrentSong } = get();
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]); // Automatically add the next song to history
    console.log("Next Song Index:", nextIndex);
  },

  previousSong: () => {
    const { currentSong, songs, setCurrentSong } = get();
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length; // Loop back to the end
    setCurrentSong(songs[previousIndex]); // Automatically add the previous song to history
    console.log("Previous Song Index:", previousIndex);
  },

  setCurrentSong: async (song) => {
    const { songs } = get();
    const index = songs.findIndex((s) => s.songID === song.songID);
    if (index !== -1) {
      set({ currentIndex: index, currentSong: song });
      console.log("Playlist:", songs); // Log the entire playlist
      console.log("Now playing:", song); // Log the current song

      // Add the song to history
      try {
        await addToHistory(song.songID || song.id);
        console.log("Song added to history:", song.songID || song.id);
      } catch (error) {
        console.error("Failed to add song to history:", error);
      }
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

  resetPlaylist: (newSongs, songToPlay) => {
    const index = newSongs.findIndex((song) => song.id === songToPlay.id);
    if (index !== -1) {
      set({
        songs: newSongs, // Update the playlist
        currentSong: songToPlay, // Set the new current song
        currentIndex: index, // Update the index
        isPlaying: true, // Start playing
      });
      console.log("Playlist reset with new songs:", newSongs);
      console.log("Now playing:", songToPlay);
    } else {
      console.error("Song to play not found in the new playlist:", songToPlay);
    }
  },
}));

export default useMusicPlayerStore;