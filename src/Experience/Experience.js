import * as THREE from 'three'

import Polyfill from './Utils/Polyfill.js'
import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import GlobalEvents from './Utils/GlobalEvents.js'
import AppState from './Utils/AppState.js'
import UIManager from './Utils/UIManager.js'
import Device from './Utils/Device.js'
import Utils from './Utils/Utils.js'
import Share from './Utils/Share.js'
import Music from './Utils/Music.js'

import sources from './sources.js'

let instance = null

export default class Experience
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this

        this.initDOM();
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        new Polyfill();
        this.utils = new Utils()
        this.device = new Device()
        this.events = new GlobalEvents()
        this.appState = new AppState()
        this.music = new Music()
        this.UIManager = new UIManager()
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.share = new Share();

        // TODO: Trigger "rotate device" screen properly accounting desktop devices.
        // TODO: Trigger "desktop splash" screen properly.

        this.addHandlers();
    }
    
    initDOM() {
        document.querySelector('body').style.opacity = 1;
    }


    addHandlers() {
        // Assets loaded and 3D ready
        this.events.on('siteReady', _ => {
            // TODO: Loader animateOut and remove it from view to not blocking everything.
            // TODO: animate in website
            this.showFirstView();
            if (this.appState.activeFlow == 'send' || ( !this.device.mobile && this.appState.activeFlow == 'receive') ) {
                this.world.candies.animateIn({ shrinkFromBig: true, halfRotation: true });
            }
        });

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    showFirstView() {
        if (this.device.mobile) {
            if (this.appState.activeFlow == 'send') {
                this.UIManager.switchViews(0);
            } else {
                this.UIManager.switchViews('receivedLanding');
            }
        } else {
            this.UIManager.switchViews('desktop');
        }
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.UIManager.update()
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active)
            this.debug.ui.destroy()
    }
}