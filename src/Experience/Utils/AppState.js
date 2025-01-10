import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

export default class AppState extends EventEmitter
{
    constructor() {
        super()

        this.experience = new Experience()
        this.events = this.experience.events
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        // Example functions, can replace their content
        this.initStates();
        this.initStepsManager();
        this.addHandlers();
    }

    initStates() {
        this.totalSteps = 3;
        this.bgColor = "pink";
    }

    reset() {
        this.currentStep = 0;
        this.trigger('stepChange', [this.currentStep]);
    }

    addHandlers() {
        this.events.on('appStateNextStep', this.nextStep.bind(this));
        this.on('stepChange', this.updateBgColor.bind(this));
    }

    initStepsManager() {
        this.next = document.getElementById('nextCandy');
        this.next.addEventListener('click', this.nextStep.bind(this));
        
        this.prev = document.getElementById('prevCandy');
        this.prev.addEventListener('click', this.prevStep.bind(this));

        this.currentStep = 0;
    }

    nextStep() {
        this.currentStep++;
        this.currentStep %= this.totalSteps;

        this.trigger('stepChange', [this.currentStep]);
    }
    
    prevStep() {
        this.currentStep--;
        if (this.currentStep < 0) this.currentStep = this.totalSteps - 1;

        this.trigger('stepChange', [this.currentStep]);
    }

    updateBgColor() {
        switch (this.currentStep) {
            case 0:
                if (this.bgColor != 'pink') {
                    this.bgColor = 'pink';
                    this.trigger('bgColorChange', [this.bgColor]);
                }
                break;
            case 1:
                if (this.bgColor != 'blue') {
                    this.bgColor = 'blue';
                    this.trigger('bgColorChange', [this.bgColor]);
                }
                break;
            case 2:
                if (this.bgColor != 'green') {
                    this.bgColor = 'green';
                    this.trigger('bgColorChange', [this.bgColor]);
                }
                break;
        }
        
    }
}