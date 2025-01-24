import * as THREE from 'three'
import Experience from '../Experience.js'

export default class AxisHelper
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

        this.initMeshes()
        this.addHandlers()
    }

    initMeshes()
    {
        const baseGeo = new THREE.BoxGeometry(0.01, 0.01, 0.01);
        const redMaterial = new THREE.MeshBasicMaterial({color: '#FF0000'})
        const greenMaterial = new THREE.MeshBasicMaterial({color: '#00FF00'})
        const blueMaterial = new THREE.MeshBasicMaterial({color: '#0000FF'})

        const xHelper = new THREE.Mesh(baseGeo, redMaterial);
        xHelper.scale.setX(20000);
        this.scene.add(xHelper);
        
        const yHelper = new THREE.Mesh(baseGeo, greenMaterial);
        yHelper.scale.setY(20000);
        this.scene.add(yHelper);
        
        const zHelper = new THREE.Mesh(baseGeo, blueMaterial);
        zHelper.scale.setZ(20000);
        this.scene.add(zHelper);
    }


    addHandlers() {
        // 
    }


    update()
    {
        // update uniforms or something
    }
}