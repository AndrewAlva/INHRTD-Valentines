import * as THREE from 'three'
import Experience from '../../Experience.js'
import BaseCandy from './BaseCandy.js';

let _this;
export default class Candies
{
    constructor()
    {
        _this = this;
        this.experience = new Experience()
        this.events = this.experience.events
        this.appState = this.experience.appState
        this.device = this.experience.device
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.appState = this.experience.appState

        this.testEnabled = false;
        this.finalRot = {};
        this.cof = 0.03;
        this.initWrappers()
        this.initCandies()

        this.addHandlers();
    }

    initWrappers() {
        this.group = new THREE.Group();
        this.idleGroup = new THREE.Group();
        this.orientationGroup = new THREE.Group();

        this.idleGroup.add(this.orientationGroup);
        this.group.add(this.idleGroup);
        this.scene.add(this.group);

        if (this.appState.activeFlow == 'receive' && this.device.mobile) this.group.visible = false;
    }

    initCandies() {
        this.mainCandy =    new BaseCandy({ inactive: this.appState.currentCandy != 0, color: '#FFA5C2', name: 'Candy1' });
        this.secondCandy =  new BaseCandy({ inactive: this.appState.currentCandy != 1, color: '#A0CDE9', name: 'Candy2' });
        this.thirdCandy =   new BaseCandy({ inactive: this.appState.currentCandy != 2, color: '#9BE6CF', name: 'Candy3' });

        this.orientationGroup.add(this.mainCandy.group, this.secondCandy.group, this.thirdCandy.group)

        this.idleMotion = {
            pos: {
                x: 0.10,
                y: 0.08,
            }
        }
    }

    async addHandlers() {
        this.appState.on('candyChange', (newCandy) => {
            if (newCandy == 0 || newCandy == 3) {
                this.mainCandy.model.visible = true;
                this.secondCandy.model.visible = false;
                this.thirdCandy.model.visible = false;

            } else if (newCandy == 1) {
                this.secondCandy.model.visible = true;
                this.mainCandy.model.visible = false;
                this.thirdCandy.model.visible = false;

            } else if (newCandy == 2) {
                this.thirdCandy.model.visible = true;
                this.mainCandy.model.visible = false;
                this.secondCandy.model.visible = false;
            }
        });

        if (this.device.mobile) {
            if (this.device.system.os == 'ios' || this.device.system.os == 'mac') {
                this.events.on('setupDeviceOrientation', this.initDeviceOrientation.bind(this));
            } else {
                const Permission = await navigator.permissions.query({ name: "gyroscope"} );
                if (Permission.state == 'granted') {
                    this.initDeviceOrientation();
                } else {
                    this.events.on('setupDeviceOrientation', this.initDeviceOrientation.bind(this));
                }
            }

        } else {
            this.initMouseGaze();
        }
    }

    initDeviceOrientation() {
        if (_this.deviceOrientationReady) return;
        _this.initOrientationTester();
        document.getElementById('landing-deviceOrientationHelper').remove();

        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then((permissionState) => {
                    if (permissionState === 'granted') {
                        console.log('permission granted');
                        
                        window.addEventListener('deviceorientation', (event) => {
                            _this.handleOrientation(event);
                        });
                        _this.deviceOrientationReady = true;
                    } else {
                        console.log('Permission denied for device orientation.');
                        if (_this.tester) _this.tester.innerHTML = 'Permission denied for device orientation.';
                    }
                })
                .catch(console.error);
        } else {
            // Non-iOS devices
            console.log('Non-iOS devices');
            window.addEventListener('deviceorientation', (event) => {
                _this.handleOrientation(event);
            });
            _this.deviceOrientationReady = true;
        }

        // window.addEventListener("deviceorientation", this.handleOrientation.bind(this), true);
    }

    handleOrientation(event) {
        console.log(event);
        console.log(`rotateDegrees = ${event.alpha};<br>leftToRight = ${event.gamma};<br>frontToBack = ${event.beta};`);
        if (_this.tester) _this.tester.innerHTML = `Alpha: ${event.alpha}. Beta Y: ${event.beta}. Gamma X: ${event.gamma}`;

        if (event.beta) _this.finalRot.x = (event.beta - 45) * Math.HALF_QUARTER_SIXTEENTH_PI;
        if (event.gamma) _this.finalRot.y = event.gamma * Math.QUARTER_SIXTEENTH_PI;

        // TODO: use gamma and beta also to alter bg candies (instanced hearts)
    }

    initMouseGaze() {
        // TODO: Add extra movement besides gaze camera.
    }

    initOrientationTester() {
        if (this.testEnabled) {
            if (!this.tester) {
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
            }
            
            this.tester.innerHTML = `${DeviceOrientationEvent.requestPermission}`;
        }

    }


    update()
    {
        // update uniforms or something
        this.idleGroup.position.x = (Math.cos(this.time.elapsed * -0.0003) * this.idleMotion.pos.x);
        this.idleGroup.position.y = (Math.sin(this.time.elapsed * -0.0007) * this.idleMotion.pos.y);
        
        this.idleGroup.rotation.y = (Math.sin(this.time.elapsed * -0.0015) * Math.HALF_SIXTEENTH_PI);
        this.idleGroup.rotation.x = (Math.cos(this.time.elapsed * -0.00007) * Math.HALF_SIXTEENTH_PI);

        if (this.finalRot.x) _this.orientationGroup.rotation.x += (this.finalRot.x - this.orientationGroup.rotation.x) * this.cof;
        if (this.finalRot.y) _this.orientationGroup.rotation.y += (this.finalRot.y - this.orientationGroup.rotation.y) * this.cof;
        

        if (this.mainCandy) this.mainCandy.update()
        if (this.secondCandy) this.secondCandy.update()
        if (this.thirdCandy) this.thirdCandy.update()
    }
}