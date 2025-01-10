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
        this.initCandiesManager();
        this.addHandlers();
    }

    initStates() {
        this.totalCandies = 3;
        this.bgColor = "pink";
    }

    reset() {
        this.currentCandy = 0;
        this.trigger('candyChange', [this.currentCandy]);
    }

    addHandlers() {
        this.events.on('appStateNextStep', this.nextStep.bind(this));
        this.on('candyChange', this.updateBgColor.bind(this));
    }

    initCandiesManager() {
        this.next = document.getElementById('nextCandy');
        this.next.addEventListener('click', this.nextStep.bind(this));
        
        this.prev = document.getElementById('prevCandy');
        this.prev.addEventListener('click', this.prevStep.bind(this));

        this.currentCandy = 0;
    }

    nextStep() {
        this.currentCandy++;
        this.currentCandy %= this.totalCandies;

        this.trigger('candyChange', [this.currentCandy]);
    }
    
    prevStep() {
        this.currentCandy--;
        if (this.currentCandy < 0) this.currentCandy = this.totalCandies - 1;

        this.trigger('candyChange', [this.currentCandy]);
    }

    updateBgColor() {
        switch (this.currentCandy) {
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