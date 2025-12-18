import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Helper to load textures
const loadTexture = (() => {
    const loader = new THREE.TextureLoader()
    return (url: string) => new Promise<THREE.Texture>((resolve) => loader.load(url, resolve))
})()

const SunClicked = ({ sunclicked, setSunClicked, NASAsunImageUrl, planet = 'sun' }: any) => {
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!containerRef.current || !sunclicked) return

        let renderer: THREE.WebGLRenderer | null = null
        let controls: OrbitControls | null = null
        let animationId: number | null = null
        let mounted = true

        ;(async () => {
            try {
                const container = containerRef.current!
                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
                const size = 200
                renderer.setSize(size, size)
                renderer.setPixelRatio(window.devicePixelRatio || 1)
                container.appendChild(renderer.domElement)

                const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
                camera.position.z = 2.8

                controls = new OrbitControls(camera, renderer.domElement)
                controls.minDistance = 1.12
                controls.maxDistance = 10
                controls.enableDamping = true

                const scene = new THREE.Scene()
                const map = await loadTexture(`https://solartextures.b-cdn.net/2k_${planet}.jpg`)
                const geom = new THREE.SphereGeometry(1, 32, 32)
                const mat = new THREE.MeshBasicMaterial({ map })
                const mesh = new THREE.Mesh(geom, mat)
                scene.add(mesh)

                const animate = () => {
                    if (!mounted || !renderer) return
                    animationId = requestAnimationFrame(animate)
                    mesh.rotation.y += 0.002
                    controls?.update()
                    renderer.render(scene, camera)
                }
                animate()
            } catch (err) {
                console.error('Sun 3D init failed:', err)
            }
        })()

        return () => {
            mounted = false
            if (animationId) cancelAnimationFrame(animationId)
            controls?.dispose()
            if (renderer) {
                renderer.forceContextLoss()
                renderer.domElement.remove()
                renderer.dispose()
            }
        }
    }, [sunclicked, planet])

    return (
        <>
            {sunclicked && (
                <>
                    <div className="fixed col-end-6 inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Sun details"
                            tabIndex={-1}
                            onKeyDown={(e) => { if (e.key === 'Escape') setSunClicked(false) }}
                            className="w-3/4 bg-linear-to-br from-cyan-900/80 to-black/80 text-white p-6 rounded-lg border border-cyan-500/50 shadow-lg shadow-cyan-500/20 grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <div className="flex items-center justify-center">
                                <div ref={containerRef} className="w-24 h-24 md:w-48 md:h-48" aria-label="3D sun preview" />
                            </div>

                            <div className="flex flex-col">
                                <img
                                    src={NASAsunImageUrl || ''}
                                    alt="Sun — NASA observation"
                                    loading="lazy"
                                    className="w-full h-auto rounded mb-4 object-cover"
                                />

                                <h3 className="text-lg font-semibold text-cyan-300 mb-2">Sun Shines in High-Energy X-rays</h3>
                              

                                <div className="mb-4">
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
                                        onClick={() => setSunClicked(false)}
                                        aria-label="Close sun details"
                                        className="w-full px-4 py-2 bg-cyan-600/50 hover:bg-cyan-500/70 text-white rounded border border-cyan-400/50 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300"
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

export default SunClicked