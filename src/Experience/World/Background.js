import * as THREE from 'three'
import { gsap } from "gsap";
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
        this.appState = this.experience.appState
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Background')
            this.debugFolder.close()
        }

        this.initColors();
        this.initMesh();
        this.addHandlers();
    }

    initColors() {
        this.targetColor = {};
        this.colors = {
            lighter: {},
            darker: {},
        }
    }

    initMesh()
    {
        this.geometry = new THREE.SphereGeometry(20, 32, 32)
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
        this.mesh.scale.y = 2
        this.mesh.rotation.y = Math.PI * 0.5
        this.scene.add(this.mesh)
    }

    addHandlers() {
        this.appState.on('bgColorChange', (newColor) => {
            // get colors
            if (!this.colors.lighter[newColor]) this.colors.lighter[newColor] = new THREE.Color(this.appState.candyColors.bgLighter[newColor]).convertLinearToSRGB();
            if (!this.colors.darker[newColor]) this.colors.darker[newColor] = new THREE.Color(this.appState.candyColors.bgDarker[newColor]).convertLinearToSRGB();
            
            this.targetColor.top = this.colors.lighter[newColor];
            this.targetColor.bottom = this.colors.darker[newColor];
            
            // tween shader
            gsap.to(this.shaderMaterial.uniforms.uColorTop.value, {
                r: this.targetColor.top.r,
                g: this.targetColor.top.g,
                b: this.targetColor.top.b,
                ease: "power3.out",
                duration: 1.7,
            });
            
            gsap.to(this.shaderMaterial.uniforms.uColorBottom.value, {
                r: this.targetColor.bottom.r,
                g: this.targetColor.bottom.g,
                b: this.targetColor.bottom.b,
                ease: "power3.out",
                duration: 1.7,
            });
        });
    }

    update()
    {
        // update uniforms or something
    }
}