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
        setSunClicked((prev) => !prev)
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
     const planetData = [
      { name: 'Mercury', radius: 2.0, distance: 42, speed: 4, texture: '8k_mercury.jpg' },
      { name: 'Venus', radius: 4.8, distance: 60, speed: 1.62, texture: '8k_venus.jpg' },
      { name: 'Earth', radius: 5.2, distance: 90, speed: 1, texture: '8k_earth.jpg' },
      { name: 'Mars', radius: 4.0, distance: 170, speed: 0.53, texture: '8k_mars.jpg' },
      { name: 'Jupiter', radius: 14.0, distance: 270, speed: 0.084, texture: '8k_jupiter.jpg' },
      { name: 'Saturn', radius: 12.0, distance: 380, speed: 0.034, texture: '8k_saturn.jpg' },
      { name: 'Uranus', radius: 8.0, distance: 480, speed: 0.012, texture: '2k_uranus.jpg' },
      { name: 'Neptune', radius: 7.6, distance: 580, speed: 0.006, texture: '2k_neptune.jpg' }
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
      } catch (e) {}

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
