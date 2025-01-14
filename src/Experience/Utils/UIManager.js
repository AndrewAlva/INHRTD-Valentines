import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'
export default class UIManager extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.device = this.experience.device
        this.appState = this.experience.appState
        this.currentView = this.appState.currentStep
        
        this.tapHoldThreshold = 1; // how many seconds to hold to finish transition.
        this.transitionSpeed = 1 / (60 * this.tapHoldThreshold);
        this.initUI();
        this.addHandlers();
    }

    initUI() {
        this.html = document.querySelector('html');
        this.views = {};

        this.views[0] = document.getElementById('landingContainer');
        this.views[1] = document.getElementById('nameContainer');
        this.views[2] = document.getElementById('selectContainer');
        this.views[3] = document.getElementById('shareContainer');
        this.views.notification = document.getElementById('notificationContainer');
        this.views.desktop = document.getElementById('desktopSplashContainer');

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
    }


    addHandlers() {
        this.appState.on('stepChange', (newStep) => {
            if (this.destroyed) return;
            this.switchViews(newStep);
        });

        this.appState.on('bgColorChange', (newColor) => {
            this.html.style.setProperty('--primary', `var(--${newColor})`);
        });

        this.appState.on('loveNameChanged', (name) => {
            this.shareNameDiv.innerHTML = name;
            this.nameInput.value = name;
            if (!name) {
                this.submitNameBtn.classList.remove('show');
                this.inputLabel.classList.add('show');
            }
        });

        // TODO: Enable swiping interaction for candy selection.
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



    destroy() {
        this.destroyed = true;
    }

    update() {
        if (this.tapHolding) {
            this.appState.tapHoldAlpha += this.transitionSpeed;
        } else {
            this.appState.tapHoldAlpha -= this.transitionSpeed;
        }
        
        this.appState.tapHoldAlpha = Math.clamp(this.appState.tapHoldAlpha);
    }
}
//test