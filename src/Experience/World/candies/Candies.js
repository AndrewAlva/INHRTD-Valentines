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
        this.appState = this.experience.appState

        this.initWrapper()
        this.initCandies()

        this.addHandlers();
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

    addHandlers() {
        this.appState.on('candyChange', (newCandy) => {
            if (newCandy == 0 || newCandy == 3) {
                this.mainCandy.mesh.visible = true;
                this.secondCandy.mesh.visible = false;
                this.thirdCandy.mesh.visible = false;

            } else if (newCandy == 1) {
                this.secondCandy.mesh.visible = true;
                this.mainCandy.mesh.visible = false;
                this.thirdCandy.mesh.visible = false;

            } else if (newCandy == 2) {
                this.thirdCandy.mesh.visible = true;
                this.mainCandy.mesh.visible = false;
                this.secondCandy.mesh.visible = false;
            }
        });
    }

    update()
    {
        // update uniforms or something
        this.group.rotation.y = this.time.elapsed * -0.001;
        

        if (this.mainCandy) this.mainCandy.update()
        if (this.secondCandy) this.secondCandy.update()
        if (this.thirdCandy) this.thirdCandy.update()
    }
}