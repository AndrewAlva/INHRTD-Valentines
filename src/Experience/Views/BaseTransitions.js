import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import Experience from '../Experience.js'

export default class BaseTransitions {
    constructor() {
        this.experience = new Experience();
        this.events = this.experience.events;
        this.appState = this.experience.appState;
        this.UIManager = this.experience.UIManager;

        this._addHandlers();
    }

    setInitialStates()  {
        console.log("BaseTransitions setInitialStates, overwrite it in child's class");
    }



    //////////////////////////
    // Handlers
    _addHandlers() {
        this.events.on('beforeSiteAnimateIn', this.handleBeforeSiteAnimateIn.bind(this));
    }

    handleBeforeSiteAnimateIn() {
        this.setInitialStates();
    }



    //////////////////////////
    // Animate IN / OUT
    animateIn() {
        console.log('default animateIn');
        
    }

    animateOut() {
        console.log('default animateOut');
        
    }
}