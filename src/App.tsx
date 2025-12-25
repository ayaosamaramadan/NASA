import { useEffect, useMemo, useRef, useState } from 'react'
import './styles/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { searchNasaImage } from './utils/nasaApi'
import { planetData } from './data/PlanetData'
import LoadingScreen from './components/hooks/LoadingScreen'
import CustomCursor from './components/hooks/CustomCursor'

import Home from './components/Home'

function App() {

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [sunclicked, setSunClicked] = useState(false)
  const [NASAsunImageUrl, setNASASunImageUrl] = useState<string | null>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [clickedPlanet, setClickedPlanet] = useState(false)
  const [NASAplanetImages, setNASAPlanetImages] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const loadingManager = useMemo(() => new THREE.LoadingManager(
    () => setIsLoading(false),
    undefined,
    () => setIsLoading(false)
  ), [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000)
    camera.position.set(0, 50, 100)

    const loader = new THREE.TextureLoader(loadingManager)
    const bgTexture = loader.load('textures/8k_stars_milky_way.jpg')

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
    const textureLoader = new THREE.TextureLoader(loadingManager)
    const sunTexture = textureLoader.load('/textures/8k_sun.jpg')

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
      <CustomCursor />
  
      {isLoading && <LoadingScreen />}
      <div
        ref={containerRef}
        id="app"
        className="w-full h-screen relative"
      >
        <Home sunclicked={sunclicked} setSunClicked={setSunClicked} NASAsunImageUrl={NASAsunImageUrl} selectedPlanet={selectedPlanet} clickedPlanet={clickedPlanet} NASAplanetImages={NASAplanetImages} />
      </div>
    </div>
  )
}

export default App
