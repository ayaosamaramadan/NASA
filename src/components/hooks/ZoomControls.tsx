import { useMap } from "react-leaflet";
import { FaPlus, FaMinus } from "react-icons/fa";


const ZoomControls = () => {
    const map = useMap();

    return (
        <div
            className="cursor-none flex leaflet-control-zoom leaflet-bar absolute bottom-[10px] left-1/2 z-[1000] transform -translate-x-1/2 shadow-2xl"
            style={{ boxShadow: "0 10px 30px rgba(11,139,133,0.18)" }}
        >
            <button
            type="button"
            className="cursor-none leaflet-control-zoom-in w-12 h-12 bg-[#0b8b85] text-white border-2 border-[rgba(255,255,255,0.15)] flex items-center justify-center p-0 m-[4px] text-[20px] font-bold leading-none shadow-[0_2px_4px_rgba(0,0,0,0.3),_inset_0_-2px_rgba(0,0,0,0.12)] transform transition duration-200 ease-out hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(11,139,133,0.25)] hover:bg-[#0ad9c8] hover:text-white hover:rotate-1 focus:outline-none focus:ring-4 focus:ring-[#0b8b85]/20 active:scale-95"
            onClick={() => map.zoomIn()}
            aria-label="Zoom in"
            style={{
                clipPath:
                "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)",
            }}
            >
            <FaPlus />
            </button>

            <button
            type="button"
            className="cursor-none leaflet-control-zoom-out w-12 h-12 bg-[#0b8b85] text-white border-2 border-[rgba(255,255,255,0.15)] flex items-center justify-center p-0 m-[4px] text-[20px] font-bold leading-none shadow-[0_2px_4px_rgba(0,0,0,0.3),_inset_0_-2px_rgba(0,0,0,0.12)] transform transition duration-200 ease-out hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(11,139,133,0.25)] hover:bg-[#0ad9c8] hover:text-white hover:-rotate-1 focus:outline-none focus:ring-4 focus:ring-[#0b8b85]/20 active:scale-95"
            onClick={() => map.zoomOut()}
            aria-label="Zoom out"
            style={{
                clipPath:
                "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)",
            }}
            >
            <FaMinus />
            </button>
        </div>
    );
};

export default ZoomControls;
