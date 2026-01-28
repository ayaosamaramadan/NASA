import { useState } from "react";
import { IoIosVolumeOff } from "react-icons/io";
import { IoIosVolumeHigh } from "react-icons/io";
import theSonga from "/song.mp3";
import useSound from "use-sound";


export default function MusicPlayer() {
    const [play , { stop }] = useSound(theSonga, { loop: true,
        autoplay: true
     });
      const [isPlaying, setIsPlaying] = useState(false)
      
    const togglePlay = () => {
        if (isPlaying) {
            stop();
            setIsPlaying(false);
        } else {
            play();
            setIsPlaying(true);
        }
    };

    return (
        <div>
            <button
                onClick={togglePlay}
                className="hover:shadow-lg hover:shadow-cyan-500/30 fixed top-8 right-8 z-50 p-3 border-cyan-600 border text-white rounded-full shadow-lg hover:bg-cyan-700 cursor-none"
            >
                {isPlaying ? <IoIosVolumeHigh size={24} /> : <IoIosVolumeOff size={24} />}
            </button>
        </div>
    );
}

