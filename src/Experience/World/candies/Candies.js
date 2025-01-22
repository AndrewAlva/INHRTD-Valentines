import * as THREE from 'three'
import Experience from '../../Experience.js'
import Candy1 from './Candy1.js'
import Candy2 from './Candy2.js'
import Candy3 from './Candy3.js'

let _this;
export default class Candies
{
    constructor()
    {
        _this = this;
        this.experience = new Experience()
        this.appState = this.experience.appState
        this.device = this.experience.device
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
        if (this.appState.activeFlow == 'receive' && this.device.mobile) this.group.visible = false;
        this.scene.add(this.group)
    }

    initCandies() {
        this.mainCandy =    new Candy1({ inactive: this.appState.currentCandy != 0 });
        this.secondCandy =  new Candy2({ inactive: this.appState.currentCandy != 1 });
        this.thirdCandy =   new Candy3({ inactive: this.appState.currentCandy != 2 });

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

        this.initDeviceOrientation();
    }

    initDeviceOrientation() {
        this.tester = document.createElement('div');
        this.tester.style.width = '80%';
        this.tester.style.display = 'block';
        this.tester.style.position = 'fixed';
        this.tester.style.top = '20px';
        this.tester.style.left = '20px';
        this.tester.style.fontSize = '14px';
        this.tester.style.backgroundColor = 'rgba(0,0,0, 0.2)';
        this.tester.style.zIndex = 999999999;
        document.body.appendChild(this.tester);
        this.tester.innerHTML = `${DeviceOrientationEvent.requestPermission}`;

        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then((permissionState) => {
                    if (permissionState === 'granted') {
                        console.log('permission granted');
                        
                        window.addEventListener('deviceorientation', (event) => {
                            _this.handleOrientation(event);
                        });
                    } else {
                        console.log('Permission denied for device orientation.');
                        this.tester.innerHTML = 'Permission denied for device orientation.';
                    }
                })
                .catch(console.error);
        } else {
            // Non-iOS devices
            console.log('Non-iOS devices');
            window.addEventListener('deviceorientation', (event) => {
                _this.handleOrientation(event);
            });
        }

        // window.addEventListener("deviceorientation", this.handleOrientation.bind(this), true);
    }

    handleOrientation(event) {
        console.log(event);
        console.log(`rotateDegrees = ${event.alpha};<br>leftToRight = ${event.gamma};<br>frontToBack = ${event.beta};`);
        _this.tester.innerHTML = `Alpha: ${event.alpha}. Beta: ${event.beta}. Gamma: ${event.gamma}`;

        _this.group.position.x = event.alpha * 0.1;
        _this.group.position.y = event.beta * 0.1;
        _this.group.position.z = event.gamma * 0.1;

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