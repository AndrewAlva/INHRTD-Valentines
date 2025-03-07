import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import Experience from '../Experience.js'

import LandingTransitions from './LandingTransitions.js'
import NameTransitions from './NameTransitions.js'
import SelectTransitions from './SelectTransitions.js'
import ShareTransitions from './ShareTransitions.js'
import NotificationTransitions from './NotificationTransitions.js'
import DesktopTransitions from './DesktopTransitions.js'
import ReceivedLandingTransitions from './ReceivedLandingTransitions.js'
import ReceivedTransitions from './ReceivedTransitions.js'

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
        this.transitions[1] = new NameTransitions();
        this.transitions[2] = new SelectTransitions();
        this.transitions[3] = new ShareTransitions();
        this.transitions.notification = new NotificationTransitions();
        this.transitions.desktop = new DesktopTransitions();
        if (this.appState.activeFlow == 'receive') {
            this.transitions.receivedLanding = new ReceivedLandingTransitions();
            this.transitions.received = new ReceivedTransitions();
        }
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