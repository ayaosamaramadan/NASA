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
