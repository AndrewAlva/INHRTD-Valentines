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
        this.device = this.experience.device
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Dark Background')
            this.debugFolder.close()
        }

        this.tapHoldThreshold = 1; // how many seconds to hold to finish transition.
        this.transitionSpeed = 1 / (60 * this.tapHoldThreshold);
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
                uColorTop: { value: new THREE.Color('#7B071B').convertLinearToSRGB() },
                uColorBottom: { value: new THREE.Color('#1D010A').convertLinearToSRGB() },
                uTransition: { value: 0 },
            }
        })

        this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial)
        this.mesh.position.y = 0
        this.mesh.scale.y = 2
        this.mesh.rotation.y = Math.PI * 0.75
        this.scene.add(this.mesh)
    }


    addHandlers() {
        var _this = this;
        this.tapTriggers = [];
        this.tapHolding = false;

        const tapAreas = document.querySelectorAll('.tapHoldTrigger');
        tapAreas.forEach(element => { this.tapTriggers.push(element) });
        this.tapTriggers.forEach(element => {
            if (_this.device.touchCapable) {
                element.addEventListener('touchstart', this.toggleTransition.bind(this), {passive: true});
                element.addEventListener('touchend', this.toggleTransition.bind(this));
            } else {
                element.addEventListener('mousedown', this.toggleTransition.bind(this));
                element.addEventListener('mouseup', this.toggleTransition.bind(this));
            }
        });
    }

    toggleTransition(e) {
        // QA NOTE: there's a chance this implementation cause bugs in production, specially on social browsers, double check this.
        // console.log(e, e.type);
        this.tapHolding = !this.tapHolding;
    }


    update()
    {
        // update uniforms or something
        if (this.tapHolding) {
            this.shaderMaterial.uniforms.uTransition.value += this.transitionSpeed;
        } else {
            this.shaderMaterial.uniforms.uTransition.value -= this.transitionSpeed;
        }
        
        this.shaderMaterial.uniforms.uTransition.value = Math.clamp(this.shaderMaterial.uniforms.uTransition.value);
    }
}