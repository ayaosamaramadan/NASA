import { useEffect, useRef } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import '../App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Link } from 'react-router'

function Apod() {
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const width = container.clientWidth || window.innerWidth
        const height = container.clientHeight || window.innerHeight

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000)
        camera.position.set(0, 50, 100)

        const loader = new THREE.TextureLoader();
        const bgTexture = loader.load('textures/apod.jpg');
        bgTexture.minFilter = THREE.LinearFilter;
        bgTexture.magFilter = THREE.LinearFilter;

        const bgGeometry = new THREE.SphereGeometry(1000, 60, 40);
        const bgMaterial = new THREE.MeshBasicMaterial({
            map: bgTexture,
            side: THREE.BackSide,
        });
        const backgroundSphere = new THREE.Mesh(bgGeometry, bgMaterial);
        scene.add(backgroundSphere);

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.shadowMap.enabled = true
        container.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

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

    return (
        <div className="App">
            <div
                ref={containerRef}
                id="app"
                className="w-full h-screen relative"
            >
                <Link to="/">
                    <button className="absolute bottom-6 rotate-46 cursor-pointer left-6 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30">
                        <IoArrowBackSharp className='rotate-[-46deg] ' />
                    </button>
                </Link>

            </div>
        </div>
    )
}

export default Apod
