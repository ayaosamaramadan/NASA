// import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import * as THREE from 'three'
import type { AppDispatch } from '../../store/store'
import {setSunClicked} from '../../features/appSlice'
import theSonga from "/sfx.mp3";
import useSound from "use-sound";

// const loadTexture = (() => {
//     const loader = new THREE.TextureLoader()
//     return (url: string) => new Promise<THREE.Texture>((resolve) => loader.load(url, resolve))
// })()

const SunDetail = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        sunclicked,
        NASAsunImageUrl
    }=useSelector((state: any) => state.app)
    const [play, { stop }] = useSound(theSonga);
 

    return (
        <>
            {sunclicked && (
                <>
                    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Sun details"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Escape') dispatch(setSunClicked(false)) }}
                            className="pointer-events-auto w-80 md:w-[28rem] p-4 rounded-xl bg-black/60 backdrop-blur-md text-white border border-cyan-500/30 shadow-xl grid grid-cols-1 gap-4"
                        >
                        

                            <div className="flex flex-col">
                                <div className="w-full h-40 rounded-lg overflow-hidden border border-white/5 mb-3">
                                    <img
                                        src={NASAsunImageUrl || ''}
                                        alt="Sun — NASA observation"
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <h3 className="text-lg font-semibold text-cyan-300 mb-1">Sun Shines in High-Energy X-rays</h3>

                                <div className="mb-2">
                                    <h4 className="text-sm font-semibold text-cyan-200 mb-2">Quick Facts</h4>
                                    <dl className="text-sm text-gray-300 grid grid-cols-2 gap-x-4 gap-y-1">
                                        <div><dt className="font-medium text-gray-200">Mass</dt><dd>1.989 × 10^30 kg</dd></div>
                                        <div><dt className="font-medium text-gray-200">Radius</dt><dd>~696,342 km</dd></div>
                                        <div><dt className="font-medium text-gray-200">Surface Temp</dt><dd>~5,500 °C</dd></div>
                                        <div><dt className="font-medium text-gray-200">Core Temp</dt><dd>~15 million °C</dd></div>
                                        <div><dt className="font-medium text-gray-200">Age</dt><dd>~4.6 billion years</dd></div>
                                        <div><dt className="font-medium text-gray-200">Distance to Earth</dt><dd>~1 AU (~150 million km)</dd></div>
                                        <div><dt className="font-medium text-gray-200">Composition</dt><dd>~75% H, 24% He (by mass)</dd></div>
                                        <div><dt className="font-medium text-gray-200">Solar Cycle</dt><dd>~11 years (sunspot activity)</dd></div>
                                    </dl>
                                </div>

                                <div className="mt-auto space-y-2">
                                    <a
                                        href="https://solarsystem.nasa.gov/solar-system/sun/overview/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block w-full text-center px-4 py-2 bg-transparent border border-cyan-400/40 text-cyan-300 rounded hover:bg-cyan-700/20 transition-colors"
                                    >
                                        Learn more at NASA
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => dispatch(setSunClicked(false))}
                                        aria-label="Close sun details"
                                        className="w-full px-4 py-2 bg-cyan-600/60 hover:bg-cyan-500/80 text-white rounded border border-cyan-400/40 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300"
                                        onMouseEnter={() => play()}
                                        onMouseLeave={() => stop()}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            )}
        </>
    )
}

export default SunDetail;