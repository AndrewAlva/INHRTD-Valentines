import Experience from '../Experience.js'
import EventEmitter from './EventEmitter.js'

export default class AppState extends EventEmitter
{
    constructor() {
        super()

        this.experience = new Experience()
        this.events = this.experience.events
        this.utils = this.experience.utils

        // Example functions, can replace their content
        this.initStates();
        this.initCandiesHandlers();
        this.addHandlers();
    }

    initStates() {
        this.bgColor = "pink";
        this.lastBgColor = "pink";
        this.totalCandies = 3;
        this.currentCandy = 0;
        this.candyColors = {
            bgLighter: {
                pink:   '#F7DEE4', // candy 0
                blue:   '#D8EBF8', // candy 1
                green:  '#ECF9F2', // candy 2
                red:    '#A1062D', // candy 3
                dark:   '#1D010A',
            },
            bgDarker: {
                pink:   '#F09EAF',
                blue:   '#A6CEE7',
                green:  '#B5E7DD',
                red:    '#B33D58',
                dark:   '#7B071B',
            },
            instances: {
                pink:   '#FF8DA1',
                blue:   '#A0CDE9',
                green:  '#9BE6CF',
                red:    '#FF8DA1',
                dark:   '#333333',
            },
            shareText: {
                pink:   '#D2566E',
                blue:   '#2E8AAE',
                green:  '#2DA8AF',
                red:    '#FFE1E1',
                dark:   '#000000',
            },
        };
        this.candyQueues = {
            pink:   0, // music start in seconds
            blue:   17, // music start in seconds
            green:  48, // music start in seconds
            red:    125, // music start in seconds
            dark:   175, // music start in seconds
        };

        this.currentStep = 0;
        this.activeFlow = this.utils.query('to') ? 'receive' : 'send'; // default is 'send', the other one is 'receive'
        this.tapHoldAlpha = 0;
        this.tapHoldMaxedOnce = false;
        this.loveName = this.utils.query('to') ? this.utils.query('to') : '';
        this.songStartTime = 0;
        this.lockBgColor = this.utils.query('to') ? true : false;

        this.loadQueryStates();
    }

    restart() {
        this.lockBgColor = false;

        this.trigger('goToCandy', [0]);
        this.trigger('goToStep', [0]);
        this.trigger('updateLoveName', ['']);

        this.utils.removeQuery('to');
        this.utils.removeQuery('theme');
        this.activeFlow = 'send';
        this.tapHoldMaxedOnce = false;
    }


    loadQueryStates() {
        const queryTheme = this.utils.query('theme') || 'pink';

        switch (queryTheme) {
            case 'pink':
                this.currentCandy = 0;
                this.bgColor = queryTheme;
                break;
            case 'blue':
                this.currentCandy = 1;
                this.bgColor = queryTheme;
                break;
            case 'green':
                this.currentCandy = 2;
                this.bgColor = queryTheme;
                break;

            default:
                this.currentCandy = 0;
                this.bgColor = 'pink';
                break;
        }

        this.songStartTime = this.candyQueues[this.bgColor];
    }
    
    initCandiesHandlers() {
        this.next = document.getElementById('nextCandy');
        this.next.addEventListener('click', this.nextCandy.bind(this));
        
        this.prev = document.getElementById('prevCandy');
        this.prev.addEventListener('click', this.prevCandy.bind(this));
    }

    addHandlers() {
        this.on('restart', this.restart.bind(this));

        this.on('candyChange', this.handleCandyChange.bind(this));
        this.on('goToCandy', this.goToCandy.bind(this));

        this.on('nextStep', this.nextStep.bind(this));
        this.on('prevStep', this.prevStep.bind(this));
        this.on('goToStep', this.goToStep.bind(this));
        this.on('stepChange', this.handleStepChange.bind(this));

        this.on('updateLoveName', this.updateLoveName.bind(this));
    }

    nextCandy() {
        this.currentCandy++;
        this.currentCandy %= this.totalCandies;

        this.trigger('candyChange', [this.currentCandy, 'right']);
    }
    
    prevCandy() {
        this.currentCandy--;
        if (this.currentCandy < 0) this.currentCandy = this.totalCandies - 1;

        this.trigger('candyChange', [this.currentCandy, 'left']);
    }

    goToCandy(candyId) {
        this.currentCandy = candyId;
        this.trigger('candyChange', [this.currentCandy]);
    }

    handleCandyChange() {
        this.updateBgColor();
        this.updateSongStartTime();
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

    updateSongStartTime() {
        this.songStartTime = this.candyQueues[this.bgColor];
        this.trigger('songStartChange', [this.songStartTime]);
    }


    nextStep() {
        this.currentStep++;
        this.trigger('stepChange', [this.currentStep]);
    }

    prevStep() {
        this.currentStep--;
        this.trigger('stepChange', [this.currentStep]);
    }

    goToStep(newStep) {
        this.currentStep = newStep;
        this.trigger('stepChange', [this.currentStep]);
    }

    handleStepChange(newStep) {
        if (newStep == 3 || newStep == 'received') {
            this.lockBgColor = true;
        } else {
            this.lockBgColor = false;
        }
    }

    updateLoveName(name) {
        this.loveName = name;
        this.trigger('loveNameChanged', [this.loveName]);
    }
}