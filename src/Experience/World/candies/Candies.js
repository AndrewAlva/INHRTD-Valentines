import * as THREE from 'three'
import Experience from '../../Experience.js'
import Candy1 from './Candy1.js'
import Candy2 from './Candy2.js'
import Candy3 from './Candy3.js'

export default class Candies
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        this.initWrapper()
        this.initCandies()
    }

    initWrapper() {
        this.group = new THREE.Group()
        this.scene.add(this.group)
    }

    initCandies() {
        this.mainCandy = new Candy1()
        this.secondCandy = new Candy2({inactive: true})
        this.thirdCandy = new Candy3({inactive: true})

        this.group.add(this.mainCandy.mesh, this.secondCandy.mesh, this.thirdCandy.mesh)
    }

    update()
    {
        // update uniforms or something
        this.group.rotation.y -= 0.01;

        if (this.mainCandy) this.mainCandy.update()
        if (this.secondCandy) this.secondCandy.update()
        if (this.thirdCandy) this.thirdCandy.update()
    }
}