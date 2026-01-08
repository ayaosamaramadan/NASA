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

import SolaSysElement from './components/sence/SolaSysElement'
import Planets from './components/sence/Planets'
import GalaxyGen from './components/sence/GalaxyGen'
import RandomStars from './components/sence/RandomStars'
import Sun from './components/sence/Sun'

function App() {

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [sunclicked, setSunClicked] = useState(false)
  const [NASAsunImageUrl, setNASASunImageUrl] = useState<string | null>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<boolean | string>(false)
  const [clickedPlanet, setClickedPlanet] = useState(false)
  const [NASAplanetImages, setNASAPlanetImages] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [threeScene, setThreeScene] = useState<THREE.Scene | null>(null)

  const [camera] = useState<THREE.PerspectiveCamera>(() => new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000))

  const loadingManager = useMemo(() => new THREE.LoadingManager(
    () => setIsLoading(false),
    undefined,
    () => setIsLoading(false)
  ), [])

  camera.position.set(0, 50, 100)
  camera.layers.enable(1)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const scene = new THREE.Scene()

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

    setThreeScene(scene)

    // const clock = new THREE.Clock()
    // let isMovingCamera = false
    // let cameraMoveStart = new THREE.Vector3()
    // let cameraMoveEnd = new THREE.Vector3()
    // let cameraMoveStartTarget = new THREE.Vector3()
    // let cameraMoveEndTarget = new THREE.Vector3()
    // let cameraMoveElapsed = 0
    // const cameraMoveDuration = 0.8
    let isSnappedToPlanet = true

    // clicks
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const sunObj = scene.getObjectByName('Sun') as THREE.Object3D | undefined
      const intersects = sunObj ? raycaster.intersectObject(sunObj) : []
      if (intersects.length > 0) {
        setSunClicked(true)
        setSelectedPlanet(false)
        setClickedPlanet(false)
        if (isSnappedToPlanet) {
          camera.position.set(0, 50, 100)
          controls.target.set(0, 0, 0)
          controls.update()
          isSnappedToPlanet = false
        }
        return
      }
      // const clickablePlanets = useRef<THREE.Object3D[]>([])
      //       const planetMeshes = scene.children.filter(
      //   obj => (obj as any).userData?.isPlanet === true
      // )
      const planetIntersects = raycaster
        .intersectObjects(scene.children, true)
        .filter(i => i.object.userData?.isPlanet)
      if (planetIntersects.length > 0) {
        const planet = planetIntersects[0].object
        const name = (planet as any).userData?.name || null
        setSelectedPlanet(name)
        setClickedPlanet(true)
        setSunClicked(false)

        try {
          const planetPos = planet.position.clone()
          const offset = new THREE.Vector3(0, 20, 60)
          const radius = (planet as any).userData?.radius || 1
          const distanceScale = Math.max(1, radius)
          const targetPos = planetPos.clone().add(offset.multiplyScalar(distanceScale))
          if (isSnappedToPlanet) {
            camera.position.set(0, 50, 100)
            controls.target.set(0, 0, 0)
            controls.update()
            isSnappedToPlanet = false
          } else {
            camera.position.copy(targetPos)
            controls.target.copy(planet.position)
            controls.update()
            isSnappedToPlanet = true
          }
          return
        } catch (e) { }
        return
      }
      if (isSnappedToPlanet) {
        isSnappedToPlanet = false
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
      try { composer.setSize(w, h) } catch (e) { }
    }
    window.addEventListener('resize', handleResize)

    let frameId = 0
    // const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    //grid helpers (1)
    const fsize = 6600;
    const fdivisions = 250;
    const fgridHelper = new THREE.GridHelper(
      fsize,
      fdivisions,
      0xD4AF37,
      0xD4AF37
    );

    fgridHelper.material.transparent = true;
    fgridHelper.material.opacity = 0.04;
    scene.add(fgridHelper);

    // grid helpers (2)
    const ssize = 6600;
    const sdivisions = 2500;
    const sgridHelper = new THREE.GridHelper(
      ssize,
      sdivisions,
      0x808080
    );

    sgridHelper.material.transparent = true;
    sgridHelper.material.opacity = 0.02;
    scene.add(sgridHelper);
    // const maxOpacity = 0.04; 

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      // const delta = clock.getDelta()
      const distance = camera.position.distanceTo(fgridHelper.position);
      fgridHelper.material.opacity = Math.min(0.04, 12000 / distance);
      sgridHelper.material.opacity = Math.min(0.02, 12000 / distance);

      // updateGridOpacity();

      // if (isMovingCamera) {
      //   cameraMoveElapsed += delta
      //   const t = Math.min(cameraMoveElapsed / cameraMoveDuration, 1)
      //   const eased = easeOutCubic(t)
      //   camera.position.lerpVectors(cameraMoveStart, cameraMoveEnd, eased)
      //   controls.target.lerpVectors(cameraMoveStartTarget, cameraMoveEndTarget, eased)

      //   if (t >= 1) {
      //   }
      // }
      controls.update()
      try {
        composer.render()
      } catch (e) { renderer.render(scene, camera) }
    }
    animate()

      ; (async () => {
        try {
          const sunUrl = await searchNasaImage('sun')
          if (sunUrl) {
            setNASASunImageUrl(sunUrl)
          }
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
        <SolaSysElement sunclicked={sunclicked} setSunClicked={setSunClicked} NASAsunImageUrl={NASAsunImageUrl} selectedPlanet={selectedPlanet} setSelectedPlanet={setSelectedPlanet} clickedPlanet={clickedPlanet} NASAplanetImages={NASAplanetImages} />
        {threeScene && (
          <>
            <GalaxyGen scene={threeScene} />
            <RandomStars scene={threeScene} />
            <Planets scene={threeScene} loadingManager={loadingManager} />
            <Sun scene={threeScene} loadingManager={loadingManager} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
