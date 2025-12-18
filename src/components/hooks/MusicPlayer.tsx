import { useEffect, useRef, useState } from "react";
import { IoIosVolumeOff } from "react-icons/io";
import { IoIosVolumeHigh } from "react-icons/io";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

 useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);
  
    const togglePlay = () => {
    if (audioRef.current) {
        if (isPlaying) {
        audioRef.current.pause();
        } else {
        audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
    }

    
  return (
    <div>
      <audio ref={audioRef} src="/song.mp3" preload="auto" autoPlay loop 
       />
      <button
        onClick={togglePlay}
        className="fixed top-8 right-8 z-50 p-3 border-cyan-600 border text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {isPlaying ? <IoIosVolumeHigh size={24} /> : <IoIosVolumeOff size={24} />}
      </button>
    </div>
  );
}
