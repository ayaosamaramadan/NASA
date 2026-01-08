import { useEffect } from 'react'
import * as THREE from 'three'
import { planetData } from '../../data/PlanetData'

type Props = {
  scene: THREE.Scene
  loadingManager?: THREE.LoadingManager
}

const Planets = ({ scene, loadingManager }: Props) => {
  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0x404040, 10);
    scene.add(ambientLight);
    if (!scene) return
    const textureLoader = new THREE.TextureLoader(loadingManager)
    const planets: THREE.Mesh[] = []

    planetData.forEach(data => {
      const geometry = new THREE.SphereGeometry(data.radius, 32, 32)
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff })

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
      ;(planet as any).userData = { name: data.name, distance: data.distance, speed: data.speed, angle: Math.random() * Math.PI * 2 }
     
      planet.layers.set(0)
      
    
  
      scene.add(planet)

      try {
        if (data.name && data.name.toLowerCase() === 'saturn') {
          const inner = data.radius * 1.8
          const outer = data.radius * 3.6
          const ringGeometry = new THREE.RingGeometry(inner, outer, 128)
          const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
          const ring = new THREE.Mesh(ringGeometry, ringMaterial)
          ring.rotation.x = Math.PI / 2
          ring.position.set(0, 0, 0)
          planet.add(ring)
        }
      } catch (e) { }

    
    
    
       const ud = (planet as any).userData
      ud.angle += ud.speed * 0.01
       const x = Math.cos(ud.angle) * ud.distance
      const z = Math.sin(ud.angle) * ud.distance
      planet.position.set(x, 0, z)

     
    
    
    
    
      try {
        const segments = 256
        const orbitPositions = new Float32Array(segments * 3)
        for (let i = 0; i < segments; i++) {
            const theta = (i / segments) * Math.PI * 2
          const ox = Math.cos(theta) * data.distance
          const oz = Math.sin(theta) * data.distance
           orbitPositions[i * 3] = ox
          orbitPositions[i * 3 + 1] = 0.02
          orbitPositions[i * 3 + 2] = oz
        }
        const orbitGeometry = new THREE.BufferGeometry()
        orbitGeometry.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3))
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 1 })
        const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial)
  
        orbit.layers.set(0)
        scene.add(orbit)
      
      
          planets.push(
            orbit as unknown as THREE.Mesh)
      } catch (e) { }

      planets.push(planet)
    })

    return () => {
      planets.forEach(p => {
        if (p.parent) p.parent.remove(p)
         try { p.geometry.dispose() } catch (e) {}
        try {
          const mat = (p.material as any)
          if (mat) {
            if (mat.map && !(Array.isArray(mat.map))) (mat.map as THREE.Texture).dispose()
            mat.dispose && mat.dispose()
 }
        } catch (e) {}
      })
    }
  }, [scene, loadingManager])

  return null
}

export default Planets
