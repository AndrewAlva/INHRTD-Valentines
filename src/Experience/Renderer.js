import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import Experience from './Experience.js'

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Renderer')
        }

        this.setInstance()
        this.setPostProcessing()
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#211d20')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    setPostProcessing() {
        this.renderTarget = new THREE.WebGLRenderTarget(
            800,
            600,
            {
                samples: 2
            }
        )

        this.effectComposer = new EffectComposer(this.instance, this.renderTarget)
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)

        this.renderPass = new RenderPass(this.scene, this.camera.instance)
        this.effectComposer.addPass(this.renderPass)

        const bokehParams = {
            focus: 1.295,       // Focus distance
            aperture: 0.3,  // Aperture size (higher = more blur)
            maxblur: 10,    // Maximum blur size
        };
        this.dofPass = new BokehPass(this.scene, this.camera.instance, bokehParams)
        this.dofPass.enabled = true
        this.effectComposer.addPass(this.dofPass)

        if(this.debug.active) {
            this.debugFolder
                .add(this.dofPass.materialBokeh.uniforms.focus, 'value')
                .name('focus')
                .min(-2)
                .max(2)
                .step(0.0001);
            this.debugFolder
                .add(this.dofPass.materialBokeh.uniforms.aperture, 'value')
                .name('aperture')
                .min(0)
                .max(2)
                .step(0.0001);
            this.debugFolder
                .add(this.dofPass.materialBokeh.uniforms.maxblur, 'value')
                .name('maxblur')
                .min(0)
                .max(10)
                .step(0.0001);
        }

        this.dotScreenPass = new DotScreenPass()
        this.dotScreenPass.enabled = false
        this.effectComposer.addPass(this.dotScreenPass)
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)

        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    update()
    {
        // this.instance.render(this.scene, this.camera.instance)
        this.effectComposer.render()
    }
}