import { useEffect, useRef, useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { FaSearchPlus } from "react-icons/fa";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { getApodImage } from '../utils/nasaApi'
import { Link } from 'react-router-dom';
import LoadingScreen from './hooks/LoadingScreen'
import CustomCursor from './hooks/CustomCursor';
import { IoIosArrowDown } from "react-icons/io";
import { BsChatText  } from "react-icons/bs";
import useSound from "use-sound";
import theSonga from "/sfx.mp3";

function Apod() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [apodData, setApodData] = useState<any | null>(null)
    const [dataReady, setDataReady] = useState(false)
    const [textureReady, setTextureReady] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isopen, setIsOpen] = useState(true);
    const [play, { stop }] = useSound(theSonga);

    // Update loading state based on data and texture readiness
    useEffect(() => {
        setIsLoading(!(dataReady && textureReady))
    }, [dataReady, textureReady])

    // Initialize Three.js scene
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const width = container.clientWidth || window.innerWidth
        const height = container.clientHeight || window.innerHeight

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000)
        camera.position.set(0, 50, 100)

        const loader = new THREE.TextureLoader()
        loader.setCrossOrigin('anonymous')

            ; (async () => {
                const daysAgo = 0
                const apod = await getApodImage(daysAgo)
                setApodData(apod)
                setDataReady(true)

                let url = apod?.url || '/textures/8k_stars_milky_way.jpg'

                try {
                    const apodHost = 'https://apod.nasa.gov'
                    if (typeof url === 'string' && url.startsWith(apodHost)) {
                        url = url.replace(apodHost, '/api/apod-proxy')
                    }
                } catch { }

                const bgTexture = loader.load(
                    url,
                    () => setTextureReady(true),
                    undefined,
                    (err) => {
                        console.warn('Failed to load APOD image, using fallback texture.', err)
                        try {
                            const fallback = loader.load('/textures/8k_stars_milky_way.jpg', () => setTextureReady(true))
                            return fallback
                        } catch {
                            setTextureReady(true)
                            return undefined
                        }
                    }
                )

                bgTexture.minFilter = THREE.LinearFilter
                bgTexture.magFilter = THREE.LinearFilter

                const bgGeometry = new THREE.SphereGeometry(1000, 64, 64)
                const bgMaterial = new THREE.MeshBasicMaterial({
                    map: bgTexture,
                    side: THREE.BackSide,
                })
                const backgroundSphere = new THREE.Mesh(bgGeometry, bgMaterial)
                scene.add(backgroundSphere)
            })().catch(() => {
                setDataReady(true)
                setTextureReady(true)
            })

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.shadowMap.enabled = true

        renderer.domElement.style.border = 'none'
        renderer.domElement.style.outline = 'none'
        renderer.domElement.style.boxShadow = 'none'
        container.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        controls.minDistance = 1

        // Handle resize
        const handleResize = () => {
            if (!container) return
            const w = container.clientWidth
            const h = container.clientHeight
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            renderer.setSize(w, h)
        }
        window.addEventListener('resize', handleResize)

        let frameId = 0
        const animate = () => {
            frameId = requestAnimationFrame(animate)

            controls.update()
            renderer.render(scene, camera)
        }

        animate()

        // Cleanup on unmount
        return () => {
            cancelAnimationFrame(frameId)
            window.removeEventListener('resize', handleResize)

            controls.dispose()
            renderer.dispose()
            if (container && renderer.domElement.parentElement === container) {
                container.removeChild(renderer.domElement)
            }
        }
    }, [])

    // handle image download
    const handleDownload = async () => {
        if (!apodData) return

        if (apodData.media_type && apodData.media_type !== 'image') {
            const openUrl = apodData.url || apodData.hdurl || ''
            if (openUrl) window.open(openUrl, '_blank')
            return
        }

        let url = apodData.hdurl || apodData.url
        if (!url) return

        try {
            const apodHost = 'https://apod.nasa.gov'
            if (typeof url === 'string' && url.startsWith(apodHost)) {
                url = url.replace(apodHost, '/api/apod-proxy')
            }
        } catch { }

        try {
            const res = await fetch(url)
            if (!res.ok) throw new Error('Network response was not ok')
            const blob = await res.blob()
            const extFromType = blob.type && blob.type.split('/')[1]
            const extFromUrl = (url.split('.').pop() || 'jpg').split('?')[0]
            const ext = extFromType || extFromUrl || 'jpg'
            const safeTitle = (apodData.title || 'apod').replace(/[^a-z0-9_-]/gi, '_').slice(0, 100)
            const filename = `${apodData.date || 'apod'}_${safeTitle}.${ext}`

            const objectUrl = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = objectUrl
            a.download = filename
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(objectUrl)
        } catch (err) {
            console.error('Download failed', err)
             const openUrl = apodData.url || apodData.hdurl || ''
            if (openUrl) window.open(openUrl, '_blank')
        }
    }

    return (
        <div className="App">
            {isLoading && <LoadingScreen />}
            <div
                ref={containerRef}
                id="app"
                className="w-full h-screen relative"
            >
                <CustomCursor />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[92vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw]">
                    <div
                        style={{
                            clipPath: 'polygon(12% 0%, 88% 0%, 100% 50%, 88% 100%, 12% 100%, 0% 50%)',
                            background: 'linear-gradient(180deg,#064b4d,#0b393b)',
                            boxShadow: 'inset 0 0 0 6px rgba(16,185,129,0.06)'
                        }}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex flex-col items-center text-center text-white"
                    >
                        <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-widest uppercase leading-tight">Astronomy Picture of the Day</h1>
                    </div>
                    <p className="text-[10px] sm:text-xs md:text-sm text-cyan-200 uppercase mt-2 text-center mx-auto max-w-3xl bg-black/40 px-3 sm:px-4 py-2 rounded-lg">
                        Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.
                    </p>
                </div>



                <div className={`absolute left-1/2 bottom-6 -translate-x-1/2 w-[95vw] md:w-11/12 lg:w-3/4 bg-[#071826cc] border border-cyan-700/60 rounded-xl p-4 sm:p-6 text-white shadow-2xl z-40 transform transition-transform duration-300 ${isopen ? 'translate-y-0' : '-translate-y-[-70%]'}`}>
                    <button
                        className="absolute top-3 right-3 z-50 p-2 bg-transparent hover:bg-white/10 rounded"
                        onClick={() => setIsOpen(prev => !prev)}
                        aria-label="Toggle details"
                        onMouseEnter={() => play()}
                        onMouseLeave={() => stop()}
                    >
                        <IoIosArrowDown className={`transition-transform duration-300 ${isopen ? '' : 'rotate-180'}`} />
                    </button>
                    <div className="flex flex-col gap-3 px-2 sm:px-4">
                        <div className="text-lg md:text-xl font-bold">{apodData?.title ?? 'Astronomy Picture of the Day'}</div>
                        <div className="text-xs text-cyan-100/70">{apodData?.date ?? '2025 December 9'}</div>
                        <p className="text-sm md:text-base mt-2 text-cyan-50/90">{apodData?.explanation ?? 'Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.'}</p>

                        <div className="flex items-center gap-3 mt-3">
                            <button
                                    className="px-3 py-2 cursor-none  bg-cyan-700/10 hover:bg-cyan-700/20 border border-cyan-600 rounded text-cyan-100 text-sm"
                                    type="button"
                                    onClick={handleDownload}
                                    onMouseEnter={() => play()}
                                    onMouseLeave={() => stop()}
                                >
                                    Download Image
                                </button>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4 md:hidden justify-center">
                        <Link to="/" className="px-3 py-2 bg-cyan-700/10 hover:bg-cyan-700/20 border border-cyan-600 rounded text-cyan-100 text-sm flex items-center gap-2">
                            <IoArrowBackSharp className='-rotate-10' />
                            <span>Back</span>
                        </Link>
                        <Link to="/solar" className="px-3 py-2 bg-cyan-700/10 hover:bg-cyan-700/20 border border-cyan-600 rounded text-cyan-100 text-sm flex items-center gap-2">
                            <FaSearchPlus className='-rotate-10' />
                            <span>Explore</span>
                        </Link>
                    </div>
                </div>


                <Link to="/" className="hidden md:block">
                    <button
                        className="transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 shadow-lg absolute top-10 rotate-46 cursor-none left-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/50 transition-all duration-300 text-white text-2xl"
                        style={{ boxShadow: '0 1px 24px rgba(0,0,0,0.85)' }}
                        onMouseEnter={() => play()}
                        onMouseLeave={() => stop()}
                    >
                        <IoArrowBackSharp className='rotate-[-46deg] ' />
                    </button>
                </Link>

                <Link to="/solar" className="hidden md:block">
                    <div className="relative z-50"></div>
                    <button
                        className="absolute bottom-10 rotate-46 cursor-none left-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30"
                        style={{ boxShadow: '0 1px 24px rgba(0,0,0,0.85)' }}
                        onMouseEnter={(e) => {
                            const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                            if (tooltip) tooltip.style.opacity = '1';
                            play();
                        }}
                        onMouseLeave={(e) => {
                            const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                            if (tooltip) tooltip.style.opacity = '0';
                            stop();
                        }}
                    >
                        <FaSearchPlus className='rotate-[-46deg]' />
                    </button>
                    <div className="absolute bottom-10 z-50 ml-7 left-18 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300" style={{ boxShadow: '0 1px 24px rgba(0,0,0,0.85)' }}>
                        Explore Solar System Planets
                    </div>
                </Link>
            </div>
            
            <Link to="/chatbot">
                <div className="relative"></div>
                <button
                    className="cursor-none absolute bottom-10 rotate-46 right-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30 shadow-lg"
                    style={{ boxShadow: '0 1px 24px rgba(0,0,0,0.85)' }}
                    onMouseEnter={(e) => {
                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                        if (tooltip) tooltip.style.opacity = '1';
                        play();
                    }}
                    onMouseLeave={(e) => {
                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                        if (tooltip) tooltip.style.opacity = '0';
                        stop();
                    }}
                >
                    <BsChatText className="rotate-[-46deg]" />
                </button>
                <div
                    className="absolute bottom-10 ml-7 right-24 z-50 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300 shadow-lg"
                    style={{ boxShadow: '0 1px 24px rgba(0,0,0,0.85)' }}
                >
                    Learn More About the Planets
                </div>
            </Link>
        </div>
    )
}

export default Apod;