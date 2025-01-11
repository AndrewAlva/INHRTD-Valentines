import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'
export default class UIManager extends EventEmitter {
    constructor() {
        super()

        this.experience = new Experience()
        this.events = this.experience.events
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.appState = this.experience.appState
        this.currentView = this.appState.currentStep
        
        // Example setup, replace their content as needed
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

        this.initTriggers();
    }

    initTriggers() {
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
    }

        fireNextStep() {
            this.events.trigger('nextStep');
        }

        firePrevStep() {
            this.events.trigger('prevStep');
        }

        fireNotificationStep() {
            this.events.trigger('goToStep', ['notification']);
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
    }

    switchViews(newStep) {
        // TODO: Validate when name input is empty before switching views.

        this.views[this.currentView].classList.remove('show');
        this.views[newStep].classList.add('show');
        this.currentView = newStep;
    }

    destroy() {
        this.destroyed = true;
    }
}
//test