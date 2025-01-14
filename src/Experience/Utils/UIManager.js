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


    addHandlers() {
        this.appState.on('stepChange', (newStep) => {
            if (this.destroyed) return;
            this.switchViews(newStep);
        });

        this.appState.on('bgColorChange', (newColor) => {
            this.html.style.setProperty('--primary', `var(--${newColor})`);
        });

        // TODO: Enable swiping interaction for candy selection.
    }

    switchViews(newStep) {
        // TODO: Validate when name input is empty before switching views. Probably better done in the click callback and before updating AppState.
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