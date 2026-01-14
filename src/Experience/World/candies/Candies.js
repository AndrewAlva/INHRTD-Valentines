import * as THREE from 'three';
import { gsap } from "gsap";
import Experience from '../../Experience.js';
import BaseCandy from './BaseCandy.js';
import TexturedBaseCandy from './TexturedBaseCandy.js';

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
        this.sliderRotation = 0;
        this.preventDoubleRotation = false;
        this.initWrappers();
        this.initCandies();
        this.initSpinControls();

        this.addHandlers();
    }

    initWrappers() {
        this.group = new THREE.Group();
        this.desktopGroup = new THREE.Group();
        this.idleGroup = new THREE.Group();
        this.orientationGroup = new THREE.Group();
        this.sliderGroup = new THREE.Group();
        this.deviceGroup = new THREE.Group();

        this.sliderGroup.add(this.deviceGroup);
        this.orientationGroup.add(this.sliderGroup);
        this.idleGroup.add(this.orientationGroup);
        this.desktopGroup.add(this.idleGroup);
        this.group.add(this.desktopGroup);
        this.scene.add(this.group);
    }

    initCandies() {
        this.mainCandy =    new TexturedBaseCandy({ inactive: this.appState.currentCandy != 0, color: '#F1CCD8', name: 'Candy1' });
        this.secondCandy =  new TexturedBaseCandy({ inactive: this.appState.currentCandy != 1, color: '#A0CDE9', name: 'Candy2' });
        this.thirdCandy =   new TexturedBaseCandy({ inactive: this.appState.currentCandy != 2, color: '#9BE6CF', name: 'Candy3' });

        this.deviceGroup.add(this.mainCandy.group, this.secondCandy.group, this.thirdCandy.group)
        this.candiesArray = [ this.mainCandy, this.secondCandy, this.thirdCandy ];

        this.idleMotion = {
            pos: {
                x: 0.10,
                y: 0.08,
            }
        }

        this.candiesArray[this.appState.currentCandy].mesh.material.opacity = 0;
        this.sliderGroup.scale.setScalar(0);
        if (!this.device.mobile) {
            this.deviceGroup.scale.setScalar(1.1);
            this.deviceGroup.position.y = -0.175;
        }
    }

    rotateCandies(turns = 1, direction = 'right', duration = 1.1) {
        if (this.preventDoubleRotation) return;
        this.preventDoubleRotation = true;
        setTimeout(() => {this.preventDoubleRotation = false}, 50);


        let dir = direction == 'right' ? 1 : -1;
        this.sliderRotation += (Math.PI_2 * turns) * dir;
        gsap.to(this.sliderGroup.rotation, {
            y: this.sliderRotation,
            ease: "power2.out",
            duration: duration,
            overwrite: "auto",
        });
    }

    shrinkPulseCandies() {
        gsap.to(this.sliderGroup.scale, {
            keyframes: {
                x: [1, 0.9, 1],
                y: [1, 0.9, 1],
                z: [1, 0.9, 1],
            },
            ease: "power2.out",
            duration: 0.9,
            overwrite: "auto",
        });
    }

    shrinkFromBig(duration = 0.9) {
        this.sliderGroup.scale.setScalar(1.35);

        gsap.to(this.sliderGroup.scale, {
            x: 1,
            y: 1,
            z: 1,
            ease: "power1.out",
            duration: duration,
            overwrite: "auto",
        });
    }

    initSpinControls() {
        var radius = 1;
        this.spinControl = new SpinControls( this.orientationGroup, radius, this.experience.camera.instance, this.experience.canvas );
        this.spinControl.setPointerToSphereMapping( this.spinControl.POINTER_SPHERE_MAPPING.HOLROYD );
        this.spinControl.spinAxisConstraint = new THREE.Vector3(0, 1, 0);
    }

    resetSpinControlPosition() {
        this.spinControl.cancelSpin();
        gsap.to(this.orientationGroup.quaternion, {
            y: 0,
            w: 1,
            duration: 1,
            ease: 'power2.out',
            // delay: 0.1,
        });
    }


    ////////////////////////////////////
    // HANDLERS
    async addHandlers() {
        this.appState.on('stepChange', (newStep) => {
            this.resetSpinControlPosition();

            if (newStep == 1) {
                this.animateOut();
            } else if (newStep == 0 || newStep == 2 || newStep == 'received') {
                this.animateIn({ shrinkFromBig: newStep != 0, halfRotation: newStep != 0 });
            } else {
                this.animateIn({ shrinkPulse: true });
            }
        });

        this.appState.on('candyChange', this.handleCandySwitch.bind(this));

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

        // TODO: Enable swiping interaction for candies rotation.
    }

    handleCandySwitch(newCandy, direction = 'right') {
        if (newCandy == 0 || newCandy == 3) {
            setTimeout(_ => {
                this.mainCandy.model.visible = true;
                this.secondCandy.model.visible = false;
                this.thirdCandy.model.visible = false;
            }, 150);

        } else if (newCandy == 1) {
            setTimeout(_ => {
                this.secondCandy.model.visible = true;
                this.mainCandy.model.visible = false;
                this.thirdCandy.model.visible = false;
            }, 150);

        } else if (newCandy == 2) {
            setTimeout(_ => {
                this.thirdCandy.model.visible = true;
                this.mainCandy.model.visible = false;
                this.secondCandy.model.visible = false;
            }, 150);
        }

        this.resetSpinControlPosition();
        this.rotateCandies(1, direction);
        this.shrinkPulseCandies();
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

        this.spinControl.update();
        // if (this.finalRot.x) _this.orientationGroup.rotation.x += (this.finalRot.x - this.orientationGroup.rotation.x) * this.cof;
        // if (this.finalRot.y) _this.orientationGroup.rotation.y += (this.finalRot.y - this.orientationGroup.rotation.y) * this.cof;


        if (this.mainCandy) this.mainCandy.update();
        if (this.secondCandy) this.secondCandy.update();
        if (this.thirdCandy) this.thirdCandy.update();

        // Desktop version, candies only show/hide with QR code.
        if (!this.device.mobile) this.desktopGroup.scale.setScalar( 1 - Math.cubicInOutLerp(this.appState.tapHoldAlpha) );

        if (!this.device.mobile || this.appState.currentStep == 3 || this.appState.currentStep == 'received' ) {
            this.desktopGroup.rotation.y = Math.cubicInOutLerp(this.appState.tapHoldAlpha) * Math.PI_2;
        }
    }

    animateIn(params = {}) {
        // Force "notification candy" which is #3 to be the same as the first candy
        const CandyID = this.appState.currentCandy == 3 ? 0 : this.appState.currentCandy;

        // Opacity
        gsap.to(this.candiesArray[CandyID].mesh.material, {
            opacity: 1,
            ease: "power2.out",
            duration: 0.9,
            overwrite: "auto",
        });


        // Scale
        if (params.shrinkPulse) {
            this.shrinkPulseCandies();

        } else if (params.shrinkFromBig) {
            this.shrinkFromBig();

        } else {
            gsap.to(this.sliderGroup.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "power1.out",
                duration: 0.9,
                overwrite: "auto",
            });
        }


        // Rotation
        if (params.halfRotation) {
            this.sliderRotation += Math.PI;
            this.sliderGroup.rotation.y = this.sliderRotation;
            this.rotateCandies(0.5);
        } else {
            this.rotateCandies();
        }
    }

    animateOut() {
        // Opacity
        gsap.to(this.candiesArray[this.appState.currentCandy].mesh.material, {
            opacity: 0,
            ease: "power2.out",
            duration: 0.5,
            overwrite: "auto",
        });

        // Scale
        gsap.to(this.sliderGroup.scale, {
            x: 0,
            y: 0,
            z: 0,
            ease: "power1.out",
            duration: 0.9,
            overwrite: "auto",
        });

        // Rotation
        this.rotateCandies(1, 'right', 2);
    }
}