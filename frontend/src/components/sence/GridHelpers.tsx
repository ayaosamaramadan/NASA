import { useEffect } from 'react'
import * as THREE from 'three'

interface Props {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
}

const GridHelpers = ({ scene, camera }: Props) => {
    useEffect(() => {
        if (!scene || !camera) return

        const fgrid = new THREE.GridHelper(6600, 250, 0x00000000, 0xd4af37)
        const sgrid = new THREE.GridHelper(6600, 2500, 0x00000000, 0x808080)
        fgrid.material.transparent = true;
        sgrid.material.transparent = true;
        fgrid.material.opacity = 0.03
        sgrid.material.opacity = 0.02

        scene.add(fgrid, sgrid)

        scene.fog = new THREE.Fog(0x000000 , 300);


        return () => {

            scene.remove(fgrid, sgrid)
            fgrid.geometry.dispose()
            sgrid.geometry.dispose()
        }
    }, [scene, camera])

    return null
}

export default GridHelpers