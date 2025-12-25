import { useEffect, useMemo, useRef, useState } from 'react'
import '../styles/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import CustomCursor from '../components/hooks/CustomCursor'
import AsteroidWatch from './AsteroidWatch'

import {getNeoBrowse} from '../utils/nasaApi'


function Neows() {

  const containerRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)

  const [neoData, setNeoData] = useState<any>(null);
  const loadingManager = useMemo(() => new THREE.LoadingManager(), [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 20, 50)

    sceneRef.current = scene




    // Starfield
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
      size: 2,
      sizeAttenuation: true,
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    stars.rotation.y += 0.001
    scene.add(stars)


    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true




    // Create earth
    const earthGeometry = new THREE.SphereGeometry(20, 32, 32)
    const textureLoader = new THREE.TextureLoader(loadingManager)
    const earthTexture = textureLoader.load('textures/night-sky-galaxy.jpg')
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    scene.add(earth)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 100);
    scene.add(ambientLight);

    const earthLight = new THREE.PointLight(0xffffff, 5, 8000);
    earthLight.position.copy(earth.position);
    scene.add(earthLight);

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
      stars.rotation.y += 0.0005
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

  useEffect(() => {
     (async () => {
        const data = await getNeoBrowse();
        setNeoData(data);
        
        if (data?.asteroids && sceneRef.current) {
          const scene = sceneRef.current
          const asteroids = data.asteroids.slice(0, 5)
          
          asteroids.forEach((asteroid: any, idx: number) => {
            if (!asteroid.close_approach_data || asteroid.close_approach_data.length === 0) return
            
          const distanceKm = asteroid.close_approach_data[0].miss_distance.kilometers
            const baseDistance = Math.max(60, Math.min(250, distanceKm / 1000000))
            
             const spacing = 45
            const distance = baseDistance + (idx * spacing)
            
            const inclination = (Math.random() - 0.5) * Math.PI * 0.8
            const longitudeOfAscendingNode = Math.random() * Math.PI * 2
            
            try {
              const segments = 256
              const positions = new Float32Array(segments * 3)
              
              for (let i = 0; i < segments; i++) {
                const theta = (i / segments) * Math.PI * 2
                
               let x = Math.cos(theta) * distance
                let y = Math.sin(theta) * distance
                let z = 0
                
                const y1 = y * Math.cos(inclination) - z * Math.sin(inclination)
                const z1 = y * Math.sin(inclination) + z * Math.cos(inclination)
                y = y1
                z = z1
                
                 const x1 = x * Math.cos(longitudeOfAscendingNode) - y * Math.sin(longitudeOfAscendingNode)
                const y2 = x * Math.sin(longitudeOfAscendingNode) + y * Math.cos(longitudeOfAscendingNode)
                x = x1
                y = y2
                
                positions[i * 3] = x
                positions[i * 3 + 1] = y
                positions[i * 3 + 2] = z
              }
              
              const orbitGeometry = new THREE.BufferGeometry()
              orbitGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
              
               const orbitColors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0xFFA07A, 0x98D8C8]
              const orbitColor = orbitColors[idx % orbitColors.length]
              
              const orbitMaterial = new THREE.LineBasicMaterial({
                color: orbitColor,
                transparent: true,
                opacity: 0.6,
              })
              const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial)
              scene.add(orbit)

              const rockTexture = new THREE.TextureLoader(loadingManager).load('/rock.png')
              const rockColors = [0x8B6F47, 0x9C8E6F, 0x7A6D5C, 0xA0826D, 0x6B5D52]
              const randomRockColor = rockColors[idx % rockColors.length]

              const theta = Math.random() * Math.PI * 2

              let x = Math.cos(theta) * distance
              let y = Math.sin(theta) * distance
              let z = 0

              const y1 = y * Math.cos(inclination) - z * Math.sin(inclination)
              const z1 = y * Math.sin(inclination) + z * Math.cos(inclination)
              y = y1
              z = z1

              const x1 = x * Math.cos(longitudeOfAscendingNode) - y * Math.sin(longitudeOfAscendingNode)
              const y2 = x * Math.sin(longitudeOfAscendingNode) + y * Math.cos(longitudeOfAscendingNode)
              x = x1
              y = y2

              const rockSize = 1.5 + Math.random() * 0.8
              const rockGeometry = new THREE.SphereGeometry(rockSize, 16, 16)
              const rockMaterial = new THREE.MeshStandardMaterial({
                color: randomRockColor,
                map: rockTexture,
                roughness: 0.8,
                metalness: 0.2,
              })
              const rock = new THREE.Mesh(rockGeometry, rockMaterial)
              rock.position.set(x, y, z)
              rock.rotation.x = Math.random() * Math.PI
              rock.rotation.y = Math.random() * Math.PI
              scene.add(rock)
            } catch (e) {
              console.warn('Error creating orbit:', e)
            }
          })
        }
    })()
  }, [])

  return (
    <div className="App">
      <CustomCursor />
    
      <div
        ref={containerRef}
        id="app"
        className="w-full h-screen overflow-hidden relative"
      >
        {neoData?.asteroids && neoData.asteroids.length > 0 && (
          <AsteroidWatch asteroids={neoData.asteroids.slice(0, 5)} />
        )}
       </div>
    </div>
  )
}

export default Neows
