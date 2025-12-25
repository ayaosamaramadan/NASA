import { useRef, useState } from "react";
import { IoIosVolumeOff } from "react-icons/io";
import { IoIosVolumeHigh } from "react-icons/io";

export default function MusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);

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
            <audio ref={audioRef} src="/song.mp3" loop autoPlay 
            
            />
            <button
                onClick={togglePlay}
                className="hover:shadow-lg hover:shadow-cyan-500/30 fixed top-8 right-8 z-50 p-3 border-cyan-600 border text-white rounded-full shadow-lg hover:bg-cyan-700 cursor-none"
            >
                {isPlaying ? <IoIosVolumeHigh size={24} /> : <IoIosVolumeOff size={24} />}
            </button>
        </div>
    );
}
