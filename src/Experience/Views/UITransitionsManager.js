import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import Experience from '../Experience.js'
import LandingTransitions from './LandingTransitions.js'

export default class UITransitionsManager {
    constructor() {
        this.experience = new Experience();
        this.events = this.experience.events;
        this.appState = this.experience.appState;
        this.UIManager = this.experience.UIManager;

        this.initTransitions();

        this.addHandlers();
    }

    initTransitions()  {
        this.transitions = {};
        this.transitions[0] = new LandingTransitions();
        // this.transitions[1] = 
        // this.transitions[2] = 
        // this.transitions[3] = 
        // this.transitions.notification = 
        // this.transitions.desktop = 
        // this.transitions.receivedLanding = 
        // this.transitions.received = 
    }


    //////////////////////////
    // Handlers
    addHandlers()  {
        this.events.on('beforeSiteAnimateIn', this.handleBeforeSiteAnimateIn.bind(this));
        this.events.on('viewChanged', this.handleViewChanged.bind(this));
    }

    handleBeforeSiteAnimateIn() {
        // 
    }

    handleViewChanged(newView) {
        // console.log('handleViewcChanged. newView:', newView, '. prevView:', this.UIManager.prevView);

        if (this.UIManager.prevView !== null) this.transitions[this.UIManager.prevView].animateOut();
        this.transitions[newView].animateIn();
    }
}