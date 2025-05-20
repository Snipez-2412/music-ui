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

  const audioSrc = currentSong?.signedFilePath || "";
  const songTitle = currentSong?.title;
  const singer = currentSong?.artistName;
  const cover = currentSong?.signedCoverUrl || "";

  useEffect(() => {
    const player = audioRef.current?.audio?.current;
    if (player && audioSrc) {
      player.src = audioSrc;
      player.play().catch((error) => {
        console.error("Failed to play audio:", error);
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
        src={audioSrc} // Bind the src directly
        autoPlay={true}
        showSkipControls={true}
        showJumpControls={false}
        onPlay={() => {
          console.log("Play event triggered");
          togglePlay();
        }}
        onPause={() => {
          console.log("Pause event triggered");
          togglePlay();
        }}
        onEnded={nextSong}
        onClickNext={nextSong}
        onClickPrevious={previousSong}
        onVolumeChange={(e) => changeVolume(e.target.volume * 100)}
        onError={(e) => console.error("Audio player error:", e)} // Log errors
      />
    </div>
  );
}

export default MusicPlayer;