import * as dat from 'dat.gui';
import { useEffect, } from 'react';
import * as THREE from 'three';

type DatProps = {
    scene: THREE.Scene;
}

const Dat = ({ scene }:
    // { scene: THREE.Scene  }
    DatProps
) => {

 useEffect(() => {
// const sunRef = useRef<THREE.Mesh | null>(null)


    
    const gui = new dat.GUI();
const para= {
    color: '#ff0000'
}


//    const sun = scene.getObjectByName('Sun') as THREE.Mesh;

       const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 4),
            new THREE.MeshBasicMaterial({ color:
                //  0x00ff00 
                para.color
                })
        );

           mesh.position.set(0 , 5, 0);

        
        scene.add(mesh);

        gui.add(mesh.position, 'x', -10, 10).min(-10).max(10).name('Position X');
        gui.add(mesh.position, 'y', -10, 10).min(-10).max(10).name('Position Y');
        gui.add(mesh.position, 'z', -10, 10).min(-10).max(10).name('Position Z');
console.log('Dat GUI mounted', mesh.position , scene.children);
        //    if (sun) {
        //     gui.add(sun.position, 'x', -100, 100).min(-100).max(100).name('Sun Position X');
        //     gui.add(sun.position, 'y', -100, 100).min(-100).max(100).name('Sun Position Y');
        //     gui.add(sun.position, 'z', -100, 100).min(-100).max(100).name('Sun Position Z');
        //             }




        return () => {
            gui.destroy();
            scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            
            }
    }, [
        scene
    ]);

         return null; 
        //  (
        //     <></>
        //  )
    }

export default Dat;