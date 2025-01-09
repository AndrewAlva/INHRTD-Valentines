import * as THREE from 'three'
import Experience from '../Experience.js'
import bgVertexShader from '../shaders/bgMain/vertex.glsl'
import bgFragmentShader from '../shaders/bgMain/frag.glsl'

export default class Background
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Background')
        }

        this.setGeometry()
    }

    setGeometry()
    {
        this.geometry = new THREE.SphereGeometry(10, 32, 32)
        this.shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: bgVertexShader,
            fragmentShader: bgFragmentShader,
            side: THREE.BackSide,
            uniforms: {
                uColorTop: { value: new THREE.Color('#F7DEE4').convertLinearToSRGB() },
                uColorBottom: { value: new THREE.Color('#F09EAF').convertLinearToSRGB() },
            }
        })

        this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial)
        this.mesh.position.y = 0
        this.scene.add(this.mesh)
    }

    update()
    {
        // update uniforms or something
    }
}