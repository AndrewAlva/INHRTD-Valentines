import { gsap } from "gsap";
import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

let _this;
export default class UIManager extends EventEmitter {
    constructor() {
        super()

        _this = this;
        this.experience = new Experience()
        this.utils = this.experience.utils
        this.device = this.experience.device
        this.events = this.experience.events
        this.appState = this.experience.appState
        this.currentView = this.appState.currentStep
        this.music = this.experience.music
        
        this.tapHoldThreshold = 1; // how many seconds to hold to finish transition.
        this.transitionSpeed = 1 / (60 * this.tapHoldThreshold);
        this.initUI();
        this.addHandlers();
    }

    initUI() {
        this.html = document.querySelector('html');
        this.html.style.setProperty('--primary', `var(--${this.appState.bgColor})`);
        this.html.style.setProperty('--primaryBg', `var(--${this.appState.bgColor}BgLight)`);
        document.body.style.backgroundColor = this.appState.candyColors.bgLighter[this.appState.bgColor]
        this.views = {};

        this.views[0] = document.getElementById('landingContainer');
        this.views[1] = document.getElementById('nameContainer');
        this.views[2] = document.getElementById('selectContainer');
        this.views[3] = document.getElementById('shareContainer');
        this.views.notification = document.getElementById('notificationContainer');
        this.views.desktop = document.getElementById('desktopSplashContainer');
        this.views.receivedLanding = document.getElementById('receivedLandingContainer');
        this.views.received = document.getElementById('receivedContainer');

        this.tapUIIcons = document.querySelectorAll('.tapUI');

        if (this.appState.activeFlow == 'receive') {
            document.getElementById('recipientName').innerHTML = this.appState.loveName;
            document.getElementById('recipientNameLanding').innerHTML = this.appState.loveName;

            document.getElementById('deskHeading').innerHTML = 'Someone has a sweet message for you';
            document.getElementById('deskName').innerHTML = this.appState.loveName;
            document.getElementById('defaultSubheading').style.display = 'none';

        } else {
            document.getElementById('receivedSubheading').style.display = 'none';
            
        }

        this.initTriggers();
        this.initNameInput();
    }

    initTriggers() {
        var _this = this;

        this.nextStepTriggers = [];

        const nextButtons = document.querySelectorAll('.nav-nextStep');
        nextButtons.forEach(element => { this.nextStepTriggers.push(element) });
        this.nextStepTriggers.forEach(element => {
            element.addEventListener('click', this.fireNextStep.bind(this));
        });

        
        this.prevStepTriggers = [];
        const prevButtons = document.querySelectorAll('.nav-prevStep');
        prevButtons.forEach(element => { this.prevStepTriggers.push(element) });
        this.prevStepTriggers.forEach(element => {
            element.addEventListener('click', this.firePrevStep.bind(this));
        });


        this.restartTriggers = [];
        const restartButtons = document.querySelectorAll('.nav-restart');
        restartButtons.forEach(element => { this.restartTriggers.push(element) });

        this.restartTriggers.forEach(element => {
            element.addEventListener('click', this.fireRestartStep.bind(this));
        });


        const notificationTrigger = document.querySelector('.nav-notificationStep');
        notificationTrigger.addEventListener('click', this.fireNotificationStep.bind(this));


        const receivedTrigger = document.querySelector('.nav-receivedStep');
        receivedTrigger.addEventListener('click', this.goToReceivedStep.bind(this));


        this.tapTriggers = [];
        this.tapHolding = false;

        const tapAreas = document.querySelectorAll('.tapHoldTrigger');
        tapAreas.forEach(element => { this.tapTriggers.push(element) });
        this.tapTriggers.forEach(element => {
            if (_this.device.touchCapable) {
                element.addEventListener('touchstart', this.toggleTransition.bind(this), {passive: true});
                element.addEventListener('touchend', this.toggleTransition.bind(this));
            } else {
                element.addEventListener('mousedown', this.toggleTransition.bind(this));
                element.addEventListener('mouseup', this.toggleTransition.bind(this));
            }
        });


        this.orientationTriggers = [];
        const orientationButtons = document.querySelectorAll('.nav-deviceOrientation');
        orientationButtons.forEach(element => { this.orientationTriggers.push(element) });

        this.orientationTriggers.forEach(element => {
            element.addEventListener('click', _ => {
                _this.events.trigger('setupDeviceOrientation');
            });
        });
    }

        fireNextStep() {
            this.appState.trigger('nextStep');
        }

        firePrevStep() {
            this.appState.trigger('prevStep');
        }

        fireNotificationStep() {
            this.appState.trigger('goToStep', ['notification']);
            this.appState.trigger('goToCandy', [3]);
        }

        goToReceivedStep() {
            this.appState.trigger('goToStep', ['received']);
        }

        fireRestartStep() {
            this.appState.trigger('restart');
        }


    initNameInput() {
        this.nameInput = document.getElementById('nameInput');
        this.inputLabel = document.getElementById('nameLabel');
        this.inputAlertContainer = document.getElementById('alertContainer');
        this.shareNameDiv = document.getElementById('shareName');
        this.submitNameBtn = document.getElementById('submitName');

        this.submitNameBtn.addEventListener('click', this.handleNameSubmit.bind(this));
        this.nameInput.addEventListener('keydown', this.handleInputTyping.bind(this));
        // TODO: fix overflow scroll on iOS safari.
        this.nameInput.addEventListener('focus', this.handleInputFocus.bind(this));
    }


    addHandlers() {
        this.appState.on('stepChange', (newStep) => {
            if (this.destroyed) return;
            this.nameInput.blur();
            this.switchViews(newStep);
        });

        this.appState.on('bgColorChange', (newColor) => {
            this.html.style.setProperty('--primary', `var(--${newColor})`);
            this.html.style.setProperty('--primaryBg', `var(--${newColor}BgLight)`);
            // document.body.style.backgroundColor = this.appState.candyColors.bgLighter[newColor];
        });

        this.appState.on('loveNameChanged', (name) => {
            this.shareNameDiv.innerHTML = name;
            this.nameInput.value = name;
            if (!name) {
                this.submitNameBtn.classList.remove('show');
                this.inputLabel.classList.add('show');
            }
        });

        this.appState.on('tapHoldMaxedOnce', _ => {
            // TODO: make sure this button animates in nicely.
            document.getElementById('receivedSpottyLink').classList.add('show');
        });
    }

    switchViews(newStep) {
        // TODO: Polish show/hide animations.
        this.views[this.currentView].classList.remove('show');
        this.views[newStep].classList.add('show');
        this.currentView = newStep;
    }

    toggleTransition(e) {
        // QA NOTE: there's a chance this implementation cause bugs in production, specially on social browsers, double check this.
        // console.log(e.type, e);
        this.tapHolding = !this.tapHolding;

        // On Desktop, don't spoil the song and background change.
        if (!this.device.mobile) return;

        // TODO: Improve tweening timing to match between colors in 3D and DOM.
        if (this.tapHolding) {
            this.appState.lastBgColor = this.appState.bgColor;
            this.appState.trigger('bgColorChange', ['dark']);

            if (this.music.audioContext.state == 'suspended') this.music.audioContext.resume();

            if (this.music.audioLoaded) {
                _this.music.fireAudioContext();
                _this.music.gainNode.gain.value = -1;
                
                gsap.to(_this.music.gainNode.gain, {
                    value: 0,
                    ease: "power3.out",
                    duration: 3,
                });

                _this.music.audioTag.play();
            }

            // TODO: Test it out in Android devices
            this.startHeartbeatInterval();

        } else {
            this.appState.trigger('bgColorChange', [this.appState.lastBgColor]);

            if (this.music.audioLoaded) {
                gsap.to(this.music.gainNode.gain, {
                    value: -1,
                    ease: "power3.out",
                    duration: 1,
                    onComplete: _ => {
                        if (!this.tapHolding) {
                            _this.music.audioTag.pause();
                            _this.music.gainNode.gain.value = -1;
                        }
                    }
                });
            }

            // TODO: Test it out in Android devices
            this.stopHeartbeatInterval();
        }
    }

    handleNameSubmit() {
        this.recipient = this.nameInput.value.trim();
        if (this.recipient.length > 0 && this.recipient.length < 15) {
            this.appState.trigger('updateLoveName', [this.recipient]);
            this.fireNextStep();
            this.inputAlertContainer.classList.remove('show');

        } else {
            // TODO: Display alert/error
            // TODO: improve animate in/out of alert
            this.inputAlertContainer.classList.add('show');
            this.inputAlertContainer.innerHTML = "No name detected, or it's too long.<br>Double check for me, ok sweetie? ❤";
        }
    }

    handleInputTyping(e) {
        setTimeout( () => {
            // TODO: improve animate in/out of alert
            this.inputAlertContainer.classList.remove('show');

            // TODO: improve animate in/out of submit button
            if (this.nameInput.value.length > 0) {
                this.submitNameBtn.classList.add('show');
                this.inputLabel.classList.remove('show');
            } else {
                this.submitNameBtn.classList.remove('show');
                this.inputLabel.classList.add('show');
            }

            if ((e.code || e.key) && (e.code.toLowerCase() == "enter" || e.key.toLowerCase() == "enter")) {
                // User hit 'enter' key, try next step
                this.handleNameSubmit();
            }
        }, 10 );
    }

    handleInputFocus(e) {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    }

    startHeartbeatInterval() {
        this.heartbeatInterval = setInterval(_ => {
            navigator.vibrate && navigator.vibrate([200, 100, 70]);
        }, 1070);
    }

    stopHeartbeatInterval() {
        clearInterval(this.heartbeatInterval);
    }



    destroy() {
        this.destroyed = true;
    }

    update() {
        // TODO: update body bgColor to match transition with dark background.
        if (this.tapHolding) {
            this.appState.tapHoldAlpha += this.transitionSpeed;
        } else {
            this.appState.tapHoldAlpha -= this.transitionSpeed;
        }

        this.appState.tapHoldAlpha = Math.clamp(this.appState.tapHoldAlpha);

        if (this.appState.tapHoldAlpha >= this.tapHoldThreshold) {
            this.appState.tapHoldMaxedOnce = true;
            this.appState.trigger('tapHoldMaxedOnce');
        }


        // On desktop, don't fade out UI elements, only Tap UI icons.
        if (this.device.mobile) {
            for (const key in this.views) {
                if (Object.prototype.hasOwnProperty.call(this.views, key)) {
                    const view = this.views[key];
                    view.style.opacity = 1 - this.appState.tapHoldAlpha;
                }
            }
        } else {
            for (const key in this.tapUIIcons) {
                if (Object.prototype.hasOwnProperty.call(this.tapUIIcons, key)) {
                    const icon = this.tapUIIcons[key];
                    icon.style.opacity = 1 - this.appState.tapHoldAlpha;
                }
            }
        }
    }
}