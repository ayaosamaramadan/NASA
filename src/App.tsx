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
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store/store'
import {
  setSunClicked,
  setNASASunImageUrl,
  setSelectedPlanet,
  setClickedPlanet,
  updateNASAPlanetImage,
  setIsLoading,
} from './features/appSlice'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [threeScene, setThreeScene] = useState<THREE.Scene | null>(null)

  // const sunclicked = useSelector((state: RootState) => state.app.sunclicked)
  // const NASAsunImageUrl = useSelector((state: RootState) => state.app.NASAsunImageUrl)
  // const selectedPlanet = useSelector((state: RootState) => state.app.selectedPlanet)
  // const clickedPlanet = useSelector((state: RootState) => state.app.clickedPlanet)
  // const NASAplanetImages = useSelector((state: RootState) => state.app.NASAplanetImages)
  const { isLoading,
    sunclicked,
    NASAsunImageUrl,
    selectedPlanet,
    clickedPlanet,
    NASAplanetImages
  } = useSelector((state: RootState) => state.app)

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
  
  const loadingManager = useMemo(
    () =>
      new THREE.LoadingManager(
        () => dispatch(setIsLoading(false)),
        undefined,
        () => dispatch(setIsLoading(false)),
      ),
    [dispatch],
  )

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
        dispatch(setSunClicked(true))
        dispatch(setSelectedPlanet(false))
        dispatch(setClickedPlanet(false))
        if (isSnappedToPlanet) {
          camera.position.set(0, 50, 100)
          controls.target.set(0, 0, 0)
          controls.update()
          isSnappedToPlanet = false
        } else {
          camera.position.set(0, 20, 60)
          controls.target.set(0, 0, 0)
          controls.update()
          isSnappedToPlanet = true

        }
        return
      }

      const planetIntersects = raycaster
        .intersectObjects(scene.children, true)
        .filter(i => i.object.userData?.isPlanet)
      if (planetIntersects.length > 0) {
        const planet = planetIntersects[0].object
        const name = (planet as any).userData?.name || null
        dispatch(setSelectedPlanet(name))
        dispatch(setClickedPlanet(true))
        dispatch(setSunClicked(false))

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

    // Click handling
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


    // Load NASA images
    ; (async () => {
      try {
        const sunUrl = await searchNasaImage('sun')
        if (sunUrl) {
          dispatch(setNASASunImageUrl(sunUrl))
        }
        for (const data of planetData) {
          const name = (data.name || '').toString()
          if (!name) continue
          const url = await searchNasaImage(name)
          if (url) {
            dispatch(updateNASAPlanetImage({ name, url }))
          }
        }
      } catch (e) {
      }
    })()

    // Animation
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const distance = camera.position.distanceTo(fgridHelper.position);
      fgridHelper.material.opacity = Math.min(0.04, 12000 / distance);
      sgridHelper.material.opacity = Math.min(0.02, 12000 / distance);
      controls.update()
      try {
        composer.render()
      } catch (e) { renderer.render(scene, camera) }
    }

    animate()

    // Cleanup
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
        <SolaSysElement
          sunclicked={sunclicked}
          setSunClicked={(v: boolean) => dispatch(setSunClicked(v))}
          NASAsunImageUrl={NASAsunImageUrl}
          selectedPlanet={selectedPlanet}
          setSelectedPlanet={(v: any) => dispatch(setSelectedPlanet(v))}
          clickedPlanet={clickedPlanet}
          NASAplanetImages={NASAplanetImages}
        />
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
