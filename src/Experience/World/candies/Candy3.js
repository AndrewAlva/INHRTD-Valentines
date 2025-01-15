import * as THREE from 'three'
import Experience from '../../Experience.js'
import testVertexShader from '../../shaders/test/vertex.glsl'
import testFragmentShader from '../../shaders/test/fragment.glsl'

export default class Candy3
{
    constructor(params = {})
    {
        this.experience = new Experience()
        this.appState = this.experience.appState
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Candy3')
            this.debugFolder.close()
        }

        this.initMesh(params);
        this.addHandlers();
    }

    initMesh(params)
    {
        this.geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
        // this.geometry = new THREE.TorusKnotGeometry(0.8, 0.25, 128)
        // this.geometry = new THREE.SphereGeometry(1.1, 32, 32)

        this.shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
            side: THREE.DoubleSide
        })
        
        this.material = new THREE.MeshStandardMaterial({
            color: '#9BE6CF',
            roughness: 0.362,
            metalness: 0.071,
            transparent: true,
            // flatShading: true,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = 0
        this.mesh.rotation.x = -0.5
        this.mesh.rotation.z = 0.25
        this.mesh.receiveShadow = true

        if (params.inactive) this.mesh.visible = false
    }

    addHandlers() {
        this.appState.on('stepChange', (newStep) => {
            // TODO: improve animate in/out of the candy
            if (newStep == 1) {
                this.mesh.material.opacity = 0;
            } else {
                this.mesh.material.opacity = 1;
            }
        });
    }


    update()
    {
        // update uniforms or something
        // this.mesh.rotation.y -= 0.01
    }
}