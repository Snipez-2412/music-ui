import React, { useEffect, useRef } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./MusicPlayer.css";
import useMusicPlayerStore from "../zustand/store/musicPlayerStore";

function MusicPlayer() {
  const {
    togglePlay,
    changeVolume,
    currentSong,
    nextSong,
    previousSong,
    setAudioRef,
  } = useMusicPlayerStore();

  const audioRef = useRef(null);

  useEffect(() => {
    setAudioRef(audioRef.current); 
  }, [setAudioRef]);

  useEffect(() => {
    const player = audioRef.current?.audio?.current;
    if (player) {
      // console.log("Setting up event listeners for audio player");
      player.addEventListener("ended", nextSong);

      return () => {
        // console.log("Cleaning up event listeners for audio player");
        player.removeEventListener("ended", nextSong);
      };
    }
  }, [audioRef, nextSong]);

  const audioSrc = currentSong?.signedFilePath || "";
  const songTitle = currentSong?.title || "No song selected";
  const singer = currentSong?.artistName || "Unknown Artist";
  const cover = currentSong?.signedCoverUrl || "";

  // useEffect(() => {
  //   console.log("Audio Source Updated:", audioSrc);
  //   console.log("Audio Ref:", audioRef.current);
  // }, [audioSrc]);

  useEffect(() => {
    const player = audioRef.current?.audio?.current;
    if (player) {
      console.log("Audio player state:", {
        paused: player.paused,
        currentTime: player.currentTime,
        duration: player.duration,
        src: player.src,
      });
    }
  }, [audioSrc]);

  return (
    <div className="music-player">
      {/* Album Info */}
      <div className="album">
        <div className="album-img">
          <img src={cover}/>
        </div>
        <div className="name">
          <p className="album-title">{songTitle}</p>
          <p className="singer">{singer}</p>
        </div>
      </div>

      {/* Audio Player */}
      <H5AudioPlayer
        ref={audioRef}
        key={audioSrc} // Force re-render when the source changes
        src={audioSrc}
        autoPlay={true}
        showSkipControls={true}
        showJumpControls={false}
        onPlay={togglePlay}
        onPause={togglePlay}
        onEnded={() => {
          nextSong();
        }}
        onClickNext={nextSong}
        onClickPrevious={previousSong}
        onVolumeChange={(e) => changeVolume(e.target.volume * 100)}
        onError={(e) => console.error("Audio player error:", e)} // Log errors
      />
    </div>
  );
}

export default MusicPlayer;