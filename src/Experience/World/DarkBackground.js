import * as THREE from 'three'
import Experience from '../Experience.js'
import bgVertexShader from '../shaders/bgDark/vertex.glsl'
import bgFragmentShader from '../shaders/bgDark/frag.glsl'

export default class DarkBackground
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.events = this.experience.events
        this.appState = this.experience.appState
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Dark Background')
            this.debugFolder.close()
        }

        this.initMesh()
        this.addHandlers()
    }

    initMesh()
    {
        this.geometry = new THREE.SphereGeometry(9, 32, 32)
        this.shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: bgVertexShader,
            fragmentShader: bgFragmentShader,
            side: THREE.BackSide,
            transparent: true,
            uniforms: {
                uScreen: { value: new THREE.Vector2(this.sizes.width * 2, this.sizes.height * 2) },
                uColorInside: { value: new THREE.Color(this.appState.candyColors.bgDarker.dark).convertLinearToSRGB() },
                uColorOutside: { value: new THREE.Color(this.appState.candyColors.bgLighter.dark).convertLinearToSRGB() },
                uMap: { value: this.resources.items.mineMSDF },
                uDisplacementMap: { value: this.resources.items.mineDisplacement },
                uTransition: { value: 0 },
                uTime: { value: 0 },
            }
        })

        this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial)
        this.mesh.position.y = 0
        this.mesh.scale.y = 2
        this.mesh.rotation.y = Math.PI * 0.5
        this.scene.add(this.mesh)
    }


    addHandlers() {
        this.events.on('resize', this.handleResize.bind(this));
    }

    handleResize() {
        this.shaderMaterial.uniforms.uScreen.value.set(this.sizes.width * 2, this.sizes.height * 2)
    }


    update()
    {
        // update uniforms or something
        if (this.mesh && this.shaderMaterial) {
            this.shaderMaterial.uniforms.uTransition.value = this.appState.tapHoldAlpha;
            this.shaderMaterial.uniforms.uTime.value = this.time.elapsed / 1000;
        }
    }
}