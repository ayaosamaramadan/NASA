import { useEffect } from 'react'
import * as THREE from 'three'

interface SunProps {
  scene: THREE.Scene
  loadingManager?: THREE.LoadingManager
}

const Sun = ({ scene, loadingManager }: SunProps) => {
  useEffect(() => {
    if (!scene) return

    const sunGeometry = new THREE.SphereGeometry(20, 32, 32)
    const textureLoader = new THREE.TextureLoader(loadingManager)
    const sunTexture = textureLoader.load('/textures/8k_sun.png')

    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    sun.name = 'Sun'
    scene.add(sun)

    // light for the sun :)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.1)
    scene.add(ambientLight)

    const sunLight = new THREE.PointLight(0xffffff, 2, 500)
    scene.add(sunLight)
    return () => {
      scene.remove(sun)
      sunGeometry.dispose()
      if (sunMaterial.map) sunMaterial.map.dispose()
      sunMaterial.dispose()
    }
  }, [scene, loadingManager])

  return null
}

export default Sun
