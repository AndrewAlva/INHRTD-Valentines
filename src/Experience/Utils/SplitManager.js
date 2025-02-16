import SplitText from '@activetheory/split-text';
import Experience from '../Experience.js'

export default class SplitManager {
    constructor() {
        this.experience = new Experience();
        this.events = this.experience.events;
        this.appState = this.experience.appState;
        this.UIManager = this.experience.UIManager;

        this.addHandlers();
    }

    initSplitText() {
        this.splitText = new SplitText('.split', {
            type: 'chars',

            linesClass: 'line',
            wordsClass: 'word',
            charsClass: 'char'
        });

        console.log(this.splitText);
    }


    addHandlers() {
        this.events.on('beforeSiteAnimateIn', this.handleBeforeSiteAnimateIn.bind(this));
        this.appState.on('updateLoveName', this.handleLoveName.bind(this));
    }

    handleBeforeSiteAnimateIn() {
        this.initSplitText();
    }

    handleLoveName() {
        // 
    }
}