import * as THREE from 'three'
import Experience from '../Experience.js'
import vertexShader from '../shaders/base-vertex.glsl'
import fragmentShader from '../shaders/qr/qr-frag.glsl'

export default class QRCode
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
            this.debugFolder = this.debug.ui.addFolder('QR Code')
            this.debugFolder.close()
        }

        this.initMesh()
        this.addHandlers()
    }

    initMesh()
    {
        this.geometry = new THREE.PlaneGeometry(1.7, 1.7)
        this.shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            // side: THREE.BackSide,
            transparent: true,
            uniforms: {
                uMap: { value: this.resources.items.qrTexture },
                uColor: { value: new THREE.Color('#7B071B').convertLinearToSRGB() },
                uTransition: { value: 0 },
            }
        })

        this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial)
        this.mesh.position.z = 1.1
        this.scene.add(this.mesh)
    }


    addHandlers() {
        // 
    }


    update()
    {
        // update uniforms or something
        if (this.mesh && this.shaderMaterial) {
            this.shaderMaterial.uniforms.uTransition.value = this.appState.tapHoldAlpha;
        }
    }
}