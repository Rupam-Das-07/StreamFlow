import React, { useRef, useState } from 'react';

interface PlayerProps {
  src: string;
  title: string;
}

const Player: React.FC<PlayerProps> = ({ src, title }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="player bg-gray-800 text-white p-4 rounded-lg flex flex-col items-center">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <audio ref={audioRef} src={src} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} />
      <button onClick={togglePlay} className="mt-2 px-4 py-2 bg-green-500 rounded hover:bg-green-600">
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default Player; 