import { useEffect, useRef } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


function App() {
  const containerRef = useRef<HTMLDivElement | null>(null)

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
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    scene.add(sun)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.1)
    scene.add(ambientLight)

    const sunLight = new THREE.PointLight(0xffffff, 2, 1000)
    sunLight.position.copy(sun.position)
    scene.add(sunLight)

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
      <div ref={containerRef} id="app" style={{ width: '100%', height: '100vh' }} />
    </div>
  )
}

export default App
