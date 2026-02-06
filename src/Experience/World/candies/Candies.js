import * as THREE from 'three';
import { gsap } from "gsap";
import Experience from '../../Experience.js';
import BaseCandy from './BaseCandy.js';
import TexturedBaseCandy from './TexturedBaseCandy.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls.js';

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
        this.arcballControls = null;
        this.folderOptions = null;
        this.folderAnimations = null;
        this.resettingArcball = false;
        this.initWrappers();
        this.initCandies();
        this.initArcBallControls();

        this.addHandlers();
    }

    initWrappers() {
        this.group = new THREE.Group();
        this.desktopGroup = new THREE.Group();
        this.spinGroup = new THREE.Group();
        this.idleGroup = new THREE.Group();
        this.orientationGroup = new THREE.Group();
        this.sliderGroup = new THREE.Group();
        this.deviceGroup = new THREE.Group();

        this.sliderGroup.add(this.deviceGroup);
        this.orientationGroup.add(this.sliderGroup);
        this.idleGroup.add(this.orientationGroup);
        this.spinGroup.add(this.idleGroup);
        this.desktopGroup.add(this.spinGroup);
        this.group.add(this.desktopGroup);
        this.scene.add(this.group);

        // Store the original quaternion for reset
        this.originalSpinGroupQuaternion = new THREE.Quaternion().copy(this.spinGroup.quaternion);
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

    initArcBallControls() {
        // Create a virtual camera for ArcballControls - we'll apply its rotation to spinGroup
        this.virtualCamera = new THREE.PerspectiveCamera();
        this.virtualCamera.position.set(0, 0, 10.3);
        
        this.arcball = {
            gizmoVisible: false,

            setArcballControls: function () {
                _this.arcballControls = new ArcballControls( _this.virtualCamera, _this.experience.renderer.instance.domElement, _this.experience.scene );
                _this.arcballControls.addEventListener( 'change', function() {
                    // Apply the virtual camera's rotation to spinGroup (inverted)
                    _this.spinGroup.quaternion.copy(_this.virtualCamera.quaternion).invert();
                    _this.experience.renderer.update();
                });
                
                // Disable pan and zoom since we only want rotation
                _this.arcballControls.enablePan = false;
                _this.arcballControls.enableZoom = false;

                _this.arcballControls.dampingFactor = 10;
                _this.arcballControls.dampingFwMaxactor = 27;
                _this.arcballControls.setGizmosVisible(false);
            },

            populateGui: function () {
                _this.folderOptions.add( _this.arcballControls, 'enabled' ).name( 'Enable controls' );
                _this.folderOptions.add( _this.arcballControls, 'enableGrid' ).name( 'Enable Grid' );
                _this.folderOptions.add( _this.arcballControls, 'enableRotate' ).name( 'Enable rotate' );
                _this.folderOptions.add( _this.arcballControls, 'enablePan' ).name( 'Enable pan' );
                _this.folderOptions.add( _this.arcballControls, 'enableZoom' ).name( 'Enable zoom' );
                _this.folderOptions.add( _this.arcballControls, 'cursorZoom' ).name( 'Cursor zoom' );
                _this.folderOptions.add( _this.arcballControls, 'adjustNearFar' ).name( 'adjust near/far' );
                _this.folderOptions.add( _this.arcballControls, 'scaleFactor', 1.1, 10, 0.1 ).name( 'Scale factor' );
                _this.folderOptions.add( _this.arcballControls, 'minDistance', 0, 50, 0.5 ).name( 'Min distance' );
                _this.folderOptions.add( _this.arcballControls, 'maxDistance', 0, 50, 0.5 ).name( 'Max distance' );
                _this.folderOptions.add( _this.arcballControls, 'minZoom', 0, 50, 0.5 ).name( 'Min zoom' );
                _this.folderOptions.add( _this.arcballControls, 'maxZoom', 0, 50, 0.5 ).name( 'Max zoom' );
                _this.folderOptions.add( _this.arcball, 'gizmoVisible' ).name( 'Show gizmos' ).onChange( function () {
                    _this.arcballControls.setGizmosVisible( _this.arcball.gizmoVisible );
                } );
                _this.folderOptions.add( _this.arcballControls, 'copyState' ).name( 'Copy state(ctrl+c)' );
                _this.folderOptions.add( _this.arcballControls, 'pasteState' ).name( 'Paste state(ctrl+v)' );
                _this.folderOptions.add( _this.arcballControls, 'reset' ).name( 'Reset' );
                _this.folderAnimations.add( _this.arcballControls, 'enableAnimations' ).name( 'Enable anim.' );
                _this.folderAnimations.add( _this.arcballControls, 'dampingFactor', 0, 100, 1 ).name( 'Damping' );
                _this.folderAnimations.add( _this.arcballControls, 'wMax', 0, 100, 1 ).name( 'Angular spd' );
            }
        };

        this.arcball.setArcballControls();
        // this.enableArcballGUI();
    }

    enableArcballGUI() {
        this.gui = new GUI();
        this.folderOptions = this.gui.addFolder( 'Arcball parameters' );
        this.folderAnimations = this.folderOptions.addFolder( 'Animations' );
        this.arcball.populateGui();

        this.folderAnimations.children[1].setValue(10);
        this.folderAnimations.children[2].setValue(27);
        this.folderOptions.children[13].setValue(true);
        this.arcball.gizmoVisible = true;
    }

    resetArcballRotations() {
        if (this.resettingArcball) return;
        this.resettingArcball = true;
        
        // Tween spinGroup quaternion back to original
        const targetQuaternion = this.originalSpinGroupQuaternion.clone();
        const currentQuaternion = this.spinGroup.quaternion.clone();

        // Create a temporary object to tween quaternion components
        const quatData = {
            x: currentQuaternion.x,
            y: currentQuaternion.y,
            z: currentQuaternion.z,
            w: currentQuaternion.w
        };

        gsap.to(quatData, {
            x: targetQuaternion.x,
            y: targetQuaternion.y,
            z: targetQuaternion.z,
            w: targetQuaternion.w,
            duration: 3.5,
            ease: "power3.out",
            overwrite: "auto",
            onUpdate: () => {
                this.spinGroup.quaternion.set(quatData.x, quatData.y, quatData.z, quatData.w).normalize();
                // Sync virtual camera's quaternion (inverted) so ArcballControls stays in sync
                this.virtualCamera.quaternion.copy(this.spinGroup.quaternion).invert();
                this.experience.renderer.update();
            },
            onComplete: () => {
                this.resettingArcball = false;
            }
        });

        // Also reset the ArcballControls state
        if (this.arcballControls) {
            this.arcballControls.reset();
        }
    }



    async addHandlers() {
        this.appState.on('stepChange', (newStep) => {
            if (newStep == 1) {
                this.animateOut();
            } else if (newStep == 0 || newStep == 2 || newStep == 'received') {
                this.animateIn({ shrinkFromBig: newStep != 0, halfRotation: newStep != 0 });
            } else {
                this.animateIn({ shrinkPulse: true });
            }

            _this.resetArcballRotations();
        });

        this.appState.on('candyChange', this.handleCandySwitch.bind(this));

        if (this.device.mobile) {
            // if (this.device.system.os == 'ios' || this.device.system.os == 'mac') {
            //     this.events.on('setupDeviceOrientation', this.initDeviceOrientation.bind(this));
            // } else {
            //     const Permission = await navigator.permissions.query({ name: "gyroscope"} );
            //     if (Permission.state == 'granted') {
            //         this.initDeviceOrientation();
            //     } else {
            //         this.events.on('setupDeviceOrientation', this.initDeviceOrientation.bind(this));
            //     }
            // }

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

        this.rotateCandies(1, direction);
        this.shrinkPulseCandies();
        this.resetArcballRotations();
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
        console.log(`rotateDegrees = ${event.alpha}; \nleftToRight = ${event.gamma}; \nfrontToBack = ${event.beta};`);
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