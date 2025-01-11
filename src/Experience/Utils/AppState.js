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
        this.initCandiesHandlers();
        this.addHandlers();
    }

    initStates() {
        this.bgColor = "pink";
        this.totalCandies = 3;
        this.currentCandy = 0;
        this.candyColors = {
            bgLighter: {
                pink: '#F7DEE4',
                blue: '#D8EBF8',
                green: '#ECF9F2',
                red: '#A1062D',
            },
            bgDarker: {
                pink: '#F09EAF',
                blue: '#A6CEE7',
                green: '#EAF9F1',
                red: '#B33D58',
            },
            instances: {
                pink: '#FF8DA1',
                blue: '#A0CDE9',
                green: '#9BE6CF',
                red: '#FF8DA1',
            },
        };

        this.currentStep = 0;
        this.activeFlow = 'give'; // default is 'give', the other one is 'receive'
    }

    reset() {
        this.currentCandy = 0;
        this.trigger('candyChange', [this.currentCandy]);
        this.trigger('appStateStep', [0]);
    }


    initCandiesHandlers() {
        this.next = document.getElementById('nextCandy');
        this.next.addEventListener('click', this.nextCandy.bind(this));
        
        this.prev = document.getElementById('prevCandy');
        this.prev.addEventListener('click', this.prevCandy.bind(this));
    }

    addHandlers() {
        this.on('reset', this.reset.bind(this));

        this.on('candyChange', this.updateBgColor.bind(this));
        this.on('goToCandy', this.goToCandy.bind(this));
        this.events.on('appStateNextStep', this.nextStep.bind(this));
        this.events.on('appStateStep', this.goToStep.bind(this));
    }

    nextCandy() {
        this.currentCandy++;
        this.currentCandy %= this.totalCandies;

        this.trigger('candyChange', [this.currentCandy]);
    }
    
    prevCandy() {
        this.currentCandy--;
        if (this.currentCandy < 0) this.currentCandy = this.totalCandies - 1;

        this.trigger('candyChange', [this.currentCandy]);
    }

    goToCandy(candyId) {
        this.currentCandy = candyId;
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
            case 3:
                if (this.bgColor != 'red') {
                    this.bgColor = 'red';
                    this.trigger('bgColorChange', [this.bgColor]);
                }
                break;
        }
        
    }


    nextStep() {
        this.currentStep++;
        this.trigger('stepChange', [this.currentStep]);
    }

    goToStep(newStep) {
        this.currentStep = newStep;
        this.trigger('stepChange', [this.currentStep]);
    }
}