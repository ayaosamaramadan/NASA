import { useEffect, useMemo, useRef, useState } from 'react'
import './styles/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { searchNasaImage } from './utils/nasaApi'
import { planetData } from './data/PlanetData'
import LoadingScreen from './components/hooks/LoadingScreen'
import CustomCursor from './components/hooks/CustomCursor'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import Home from './components/Home'
import Planets from './components/Planets'

function App() {

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [sunclicked, setSunClicked] = useState(false)
  const [NASAsunImageUrl, setNASASunImageUrl] = useState<string | null>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [clickedPlanet, setClickedPlanet] = useState(false)
  const [NASAplanetImages, setNASAPlanetImages] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [threeScene, setThreeScene] = useState<THREE.Scene | null>(null)
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
    camera.layers.enable(1)

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
   
    renderer.autoClear = false
    container.appendChild(renderer.domElement)

    const renderPass = new RenderPass(scene, camera)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 2.5, 0.6, 0.0)
    bloomPass.threshold = 0
 
bloomPass.strength = 1.5

    bloomPass.radius = 0.8
    const composer = new EffectComposer(renderer)
    composer.addPass(renderPass)
    composer.addPass(bloomPass)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // expose scene to Planets component
    try { setThreeScene(scene) } catch (e) {}

   







    
    const starCount = 1500
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 1200
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1200
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1200
    }

    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 3,
      sizeAttenuation: true,
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Create sun
    const sunGeometry = new THREE.SphereGeometry(20, 32, 32)
    const textureLoader = new THREE.TextureLoader(loadingManager)
    const sunTexture = textureLoader.load('/textures/8k_sun.png')

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

  
    
    // Handle resize
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      try { composer.setSize(w, h) } catch (e) {}
    }
    window.addEventListener('resize', handleResize)

    let frameId = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      galaxy.rotation.y += 0.001

      stars.rotation.y += 0.0005
      controls.update()

       try {
        composer.render()

        } catch (e) { renderer.render(scene, camera) }
    }



// Galaxy generation (scaled up so it is visible with the existing camera distance)
const galaxyGeometry = new THREE.BufferGeometry()
const count = 10000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
const galaxyRadius = 680

const colorInside = new THREE.Color(0xffaa00)
const colorOutside = new THREE.Color(0x001a4d)

for (let i = 0; i < count; i++) {
  const i3 = i * 3
    const radius = Math.random() * galaxyRadius
  const spinAngle = radius * 0.9
const branches = 200
const branchAngle = (i % branches) / branches * Math.PI * 6


  positions[i3] = Math.cos(branchAngle + spinAngle) * radius
  positions[i3 + 1] = (Math.random() - 0.5) * 8
  positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius

  const mixedColor = colorInside.clone()
  mixedColor.lerp(colorOutside, radius / galaxyRadius)
  colors[i3] = mixedColor.r
  colors[i3 + 1] = mixedColor.g
  colors[i3 + 2] = mixedColor.b
}

galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const galaxyMaterial = new THREE.PointsMaterial({
 
  size: 0.1,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true
})

const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial)
galaxy.position.set(0, -5, 0)
scene.add(galaxy)


    animate()

      ; (async () => {
        try {
          // Sun
          const sunUrl = await searchNasaImage('sun')
          if (sunUrl) {
            setNASASunImageUrl(sunUrl)
          }

          // Planets (use planetData instead of runtime meshes)
          for (const data of planetData) {
            const name = (data.name || '').toString()
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
        {threeScene && <Planets scene={threeScene} loadingManager={loadingManager} />}
      </div>
    </div>
  )
}

export default App
