import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface StarsProps {
  scene: THREE.Scene
  count?: number
}

const RandomStars = ({ scene, count = 2000 }: StarsProps) => {
  const starsRef = useRef<THREE.Points | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!scene) return

    const starCount = Math.max(0, Math.floor(count))
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
      size: 3,
      sizeAttenuation: true,
      depthWrite: false,
      transparent: true,
      opacity: 0.9,
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    stars.frustumCulled = false
    stars.position.set(0, 0, 0)
    starsRef.current = stars
    scene.add(stars)

    const animate = () => {
      if (starsRef.current) {
          stars.rotation.y += 0.0005
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (starsRef.current) scene.remove(starsRef.current)
      starGeometry.dispose()
      starMaterial.dispose()
      starsRef.current = null
    }
  }, [scene, count])

  return null
}

export default RandomStars