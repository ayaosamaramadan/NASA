import { useEffect, useRef, useState } from 'react'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { searchNasaImage } from './utils/nasaApi'
import { planetData } from './data/PlanetData'
import { Link } from 'react-router'

import { FaSearchPlus } from "react-icons/fa";
import { FaUserAstronaut } from "react-icons/fa6";

function App() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [sunclicked, setSunClicked] = useState(false)
  const [NASAsunImageUrl, setNASASunImageUrl] = useState<string | null>(null)

  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [clickedPlanet, setClickedPlanet] = useState(false)
  const [NASAplanetImages, setNASAPlanetImages] = useState<Record<string, string>>({})

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000)
    camera.position.set(0, 50, 100)

    const loader = new THREE.TextureLoader();
    const bgTexture = loader.load('textures/8k_stars_milky_way.jpg');

    const bgGeometry = new THREE.SphereGeometry(1000, 64, 64);
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

    // Create sun
    const sunGeometry = new THREE.SphereGeometry(20, 32, 32)
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('/textures/8k_sun.jpg');

    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    scene.add(sun)

    // clicks
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(sun)
      if (intersects.length > 0) {
        console.log('click sun')
        setSunClicked(true)
        setSelectedPlanet(null)
        setClickedPlanet(false)
        return
      }
      const planetIntersects = raycaster.intersectObjects(scene.children.filter(obj => obj !== sun))
      if (planetIntersects.length > 0) {
        const planet = planetIntersects[0].object
        const name = (planet as any).userData?.name || null
        setSelectedPlanet(name)
        setClickedPlanet(true)
        setSunClicked(false)
      }
    }

    window.addEventListener('click', onClick)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 100);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 5, 8000);
    sunLight.position.copy(sun.position);
    scene.add(sunLight);

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

    // Create planets
    const planets: THREE.Mesh[] = []

    planetData.forEach(data => {
      const geometry = new THREE.SphereGeometry(data.radius, 32, 32)
      const material = new THREE.MeshStandardMaterial({

        color: 0xffffff,
      })

      if (data.texture) {
        const path = `/textures/${data.texture}`
        textureLoader.load(
          path,
          (tex) => {
            material.map = tex
            material.needsUpdate = true
          },
          undefined,
          (err) => {
            console.warn(`Failed to load texture ${path}:`, err)
          }
        )
      }

      const planet = new THREE.Mesh(geometry, material)
        ; (planet as any).userData = { name: data.name, distance: data.distance, speed: data.speed, angle: Math.random() * Math.PI * 2 }
      scene.add(planet)

      try {
        if (data.name && data.name.toLowerCase() === 'saturn') {
          const inner = data.radius * 1.8
          const outer = data.radius * 3.6
          const ringGeometry = new THREE.RingGeometry(inner, outer, 128)
          const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xC2B280, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
          const ring = new THREE.Mesh(ringGeometry, ringMaterial)
          ring.rotation.x = Math.PI / 2
          ring.position.set(0, 0, 0)
          planet.add(ring)
        }
      } catch (e) { }

      try {
        const segments = 256
        const positions = new Float32Array(segments * 3)
        for (let i = 0; i < segments; i++) {
          const theta = (i / segments) * Math.PI * 2
          const x = Math.cos(theta) * data.distance
          const z = Math.sin(theta) * data.distance
          positions[i * 3] = x
          positions[i * 3 + 1] = 0.02
          positions[i * 3 + 2] = z
        }
        const orbitGeometry = new THREE.BufferGeometry()
        orbitGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.6 })
        const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial)
        scene.add(orbit)
      } catch (e) {

      }

      planets.push(planet)
    })

    planets.forEach(planet => {
      const ud = (planet as any).userData
      ud.angle += ud.speed * 0.01
      const x = Math.cos(ud.angle) * ud.distance
      const z = Math.sin(ud.angle) * ud.distance
      planet.position.set(x, 0, z)
    })

    animate()

      ; (async () => {
        try {
          // Sun
          const sunUrl = await searchNasaImage('sun')
          if (sunUrl) {
            setNASASunImageUrl(sunUrl)
          }

          // Planets
          for (const planet of planets) {
            const name = ((planet as any).userData?.name || '').toString()
            if (!name) continue
            const url = await searchNasaImage(name)
            if (url) {
              setNASAPlanetImages(prev => ({ ...prev, [name]: url }))
            }
          }
        } catch (e) {

        }
      })()

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('click', onClick)
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
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
          <div
            style={{
              clipPath: 'polygon(12% 0%, 88% 0%, 100% 50%, 88% 100%, 12% 100%, 0% 50%)',
              background: 'linear-gradient(180deg,#064b4d,#0b393b)',
              boxShadow: 'inset 0 0 0 6px rgba(16,185,129,0.06)'
            }}
            className="px-10 py-3 rounded-xl flex flex-col items-center text-center text-white"
          >
            <h1 className="text-2xl font-extrabold tracking-widest uppercase">
              Solar System
            </h1>
          </div>

        </div>
        {sunclicked && (
          <div className="info-box fixed bottom-5 left-5 z-10 bg-linear-to-br from-cyan-900/80 to-black/80 text-white p-6 rounded-lg border border-cyan-500/50 shadow-lg shadow-cyan-500/20 max-w-sm">
            <img src={NASAsunImageUrl || ''} alt="Sun" className="w-full h-auto rounded mb-4" />
            <h3 className="text-lg font-semibold text-cyan-300">Sun Shines in High-Energy X-rays</h3>
            <p className="text-sm mb-4 text-gray-300">
              X-rays stream off the sun in this first picture of the sun, overlaid on a picture taken by NASA Solar Dynamics Observatory SDO, taken by NASA NuSTAR. The field of view covers the west limb of the sun.
            </p>
            <button
              onClick={() => setSunClicked(false)}
              className="w-full px-4 py-2 bg-cyan-600/50 hover:bg-cyan-500/70 text-white rounded border border-cyan-400/50 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {selectedPlanet && clickedPlanet && !sunclicked && (
          <div className="info-box fixed bottom-5 right-5 z-10 bg-gradient-to-br from-purple-900/80 to-black/80 text-white p-6 rounded-lg border border-purple-500/50 shadow-lg shadow-purple-500/20 max-w-sm max-h-screen overflow-y-auto">
            <img src={NASAplanetImages[selectedPlanet] || ''} alt={selectedPlanet} className="w-full h-64 object-cover rounded" />
            <h3 className="text-lg font-semibold text-purple-300">{selectedPlanet}</h3>

            {planetData.filter(p => p.name === selectedPlanet).map(p => (
              <div key={p.name} className="text-sm mb-4 text-gray-300">
                <p><strong>Type:</strong> {p.type}</p>
                <p><strong>Mass (Earth=1):</strong> {p.mass}</p>
                <p><strong>Moons:</strong> {p.moons}</p>
                <p><strong>Distance from Sun (million km):</strong> {p.distance}</p>
                <p><strong>Radius (thousand km):</strong> {p.radius}</p>
              </div>
            ))}
            <button
              onClick={() => setSelectedPlanet(null)}
              className="w-full px-4 py-2 bg-purple-600/50 hover:bg-purple-500/70 text-white rounded border border-purple-400/50 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        <Link to="/apod">
          <div className="relative"></div>
          <button
            className="absolute bottom-34 rotate-46 cursor-pointer left-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30"
            onMouseEnter={(e) => {
              const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
              if (tooltip) tooltip.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
              if (tooltip) tooltip.style.opacity = '0';
            }}
          >
            <FaUserAstronaut className='rotate-[-46deg]' />
          </button>
          <div className="absolute bottom-34 ml-7 left-18 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300">
            View Astronomy Picture of the Day
          </div>

        </Link>

        <Link to="/solar">
          <div className="relative"></div>
          <button
            className="absolute bottom-10 rotate-46 cursor-pointer left-10 p-3 hover:bg-cyan-500/40 border border-cyan-500/90 transition-all duration-300 text-white text-2xl hover:shadow-lg hover:shadow-cyan-500/30"
            onMouseEnter={(e) => {
              const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
              if (tooltip) tooltip.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
              if (tooltip) tooltip.style.opacity = '0';
            }}
          >
            <FaSearchPlus className='rotate-[-46deg]' />
          </button>
          <div className="absolute bottom-10 ml-7 left-18 bg-black text-white text-sm p-2 rounded opacity-0 transition-opacity duration-300">
            Explore Solar System Planets
          </div>
        </Link>

      </div>
    </div>
  )
}

export default App
