import * as THREE from 'three'
import { gsap } from "gsap";
import Experience from '../Experience.js'

export default class Heart1
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.appState = this.experience.appState
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Instanced Hearts')
            this.debugFolder.close()
        }

        this.colors = {};
        this.initMesh();
        this.initInstances();
        this.addHandlers();
    }

    initMesh()
    {
        var size = 0.35;
        this.geometry = new THREE.BoxGeometry(size, size, size)
        // this.geometry = new THREE.TorusKnotGeometry(size, size * 0.3, 64)
        
        this.material = new THREE.MeshStandardMaterial({
            // color: '#9B052C',
            color: this.appState.candyColors.instances.pink,
            roughness: 0,
            metalness: 0.5,
            // flatShading: true,
        });
    }

    initInstances() {
        this.instancesTotal = 30;
        this.instancedMesh = new THREE.InstancedMesh(this.geometry, this.material, this.instancesTotal);
        this.instancedMesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame
        this.instancedMesh.castShadow = true;
        this.scene.add(this.instancedMesh);
        this.instancesTransformations = [];
        

        for (let i = 0; i < this.instancesTotal; i++) {
            const dummy = new THREE.Object3D();

            // Set random position for each instance
            dummy.position.set(
                Math.random() * 18 - 9,
                Math.random() * 28 - 14,
                Math.random() * 18 - 14
            );
            
            // Optionally set random rotation and scale
            dummy.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            dummy.scale.set(
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 0.5
            );

            dummy.speed = Math.random() * 0.01 + 0.01

            // Update the matrix for this instance
            dummy.updateMatrix();
            this.instancedMesh.setMatrixAt(i, dummy.matrix);

            // Save dummy object so it can be animated or transformed later
            this.instancesTransformations.push(dummy);
        }

        // Make sure the matrix updates are reflected in the GPU
        this.instancedMesh.instanceMatrix.needsUpdate = true;
        this.instancedMesh.computeBoundingSphere();
        
    }


    addHandlers() {
        this.appState.on('bgColorChange', (newColor) => {
            // get colors
            if (!this.colors[newColor]) this.colors[newColor] = new THREE.Color(this.appState.candyColors.instances[newColor]);
            
            // tween shader
            gsap.to(this.instancedMesh.material.color, {
                r: this.colors[newColor].r,
                g: this.colors[newColor].g,
                b: this.colors[newColor].b,
                ease: "power3.out",
                duration: 1.7,
            });
        });
    }


    update()
    {
        // update uniforms or something
        for (let i = 0; i < this.instancesTransformations.length; i++) {
            const dummy = this.instancesTransformations[i];
            dummy.position.y -= dummy.speed;
            dummy.rotation.y += 0.015;
            if (dummy.position.y <= -15) dummy.position.y = 15;
            dummy.updateMatrix();
            this.instancedMesh.setMatrixAt(i, dummy.matrix);
        }
        this.instancedMesh.instanceMatrix.needsUpdate = true;
        this.instancedMesh.computeBoundingSphere();
    }
}