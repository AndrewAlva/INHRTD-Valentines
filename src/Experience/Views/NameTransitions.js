import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import BaseTransitions from './BaseTransitions.js'

export default class NameTransitions extends BaseTransitions {
    constructor() {
        super();
        this.initUI();

        this.addHandlers();
    }

    initUI() {
        // 
    }

    setInitialStates()  {
        // 
    }



    //////////////////////////
    // Handlers
    addHandlers() {
        this.appState.on('updateLoveName', this.handleLoveName.bind(this));
    }

    handleLoveName() {
        // 
    }



    //////////////////////////
    // Animate IN / OUT
    animateIn() {
        console.log('animateIn NameTransitions');
    }

    animateOut() {
        console.log('animateOut NameTransitions');
        // 
    }
}