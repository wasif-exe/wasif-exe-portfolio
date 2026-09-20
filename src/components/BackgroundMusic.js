import React, { useRef, useState } from 'react';

const BackgroundMusic = ({ volume = 0.5, loop = true }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.volume = volume;
        audioRef.current.play()
          .then(() => console.log("Music started playing 🎵"))
          .catch(err => console.error("Playback error:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="mute-button-wrapper">
      <audio ref={audioRef} src="/music/audio.mp3" loop={loop} />
      <button className="mute-button" onClick={toggleMusic}>
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </div>
  );
};

export default BackgroundMusic;
