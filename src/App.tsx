import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


function App() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [sunclicked, setSunClicked] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000)
    camera.position.set(0, 50, 100)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Create sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32)
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('/textures/sun3d.jpg');

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
        setSunClicked((prev) => !prev)
      }
    }

    window.addEventListener('click', onClick)


    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 100); // Soft white light
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
    const planetData = [
      { name: 'Mercury', radius: 0.5, distance: 10, speed: 4, texture: 'sun3d.jpg' },
      { name: 'Venus', radius: 1.2, distance: 18, speed: 1.62, texture: 'sun3d.jpg' },
      { name: 'Earth', radius: 1.3, distance: 25, speed: 1, texture: 'sun3d.jpg' },
      { name: 'Mars', radius: 1.0, distance: 38, speed: 0.53, texture: 'sun3d.jpg' },
      { name: 'Jupiter', radius: 3.5, distance: 130, speed: 0.084, texture: 'sun3d.jpg' },
      { name: 'Saturn', radius: 3.0, distance: 240, speed: 0.034, texture: 'sun3d.jpg' },
      { name: 'Uranus', radius: 2.0, distance: 482, speed: 0.012, texture: 'sun3d.jpg' },
      { name: 'Neptune', radius: 1.9, distance: 752, speed: 0.006, texture: 'sun3d.jpg' }
    ]


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
      ;(planet as any).userData = { distance: data.distance, speed: data.speed, angle: Math.random() * Math.PI * 2 }
      scene.add(planet)

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
        {sunclicked && (
          <div
            className="info-box fixed bottom-5 left-5 z-10 bg-black/70 text-white p-3 rounded-lg"
          >
            <h2>Sun Information</h2>
            <p>
              The Sun
            </p>
            <button onClick={() => setSunClicked(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
