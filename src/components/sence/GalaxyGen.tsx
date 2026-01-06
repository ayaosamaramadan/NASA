import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface GalaxyGenProps {
  scene: THREE.Scene
}

const GalaxyGen = ({ scene }: GalaxyGenProps) => {
  const galaxyRef = useRef<THREE.Points | null>(null)

  useEffect(() => {
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
    galaxyRef.current = galaxy
    scene.add(galaxy)

    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      galaxy.rotation.y += 0.001
    }
    animate()

  
    return () => {
      cancelAnimationFrame(animationId)
      scene.remove(galaxy)
      galaxyGeometry.dispose()
      galaxyMaterial.dispose()
    }
  }, [scene])

  return null
}

export default GalaxyGen