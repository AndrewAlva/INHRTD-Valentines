import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import BaseTransitions from './BaseTransitions.js'

export default class SelectTransitions extends BaseTransitions {
    constructor() {
        super();
        this.initUI();

        this.addHandlers();
    }

    initUI() {
        this.view = document.getElementById('selectContainer');
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
        console.log('animateIn SelectTransitions');
        this.view.classList.add('show');
    }

    animateOut() {
        console.log('animateOut SelectTransitions');
        this.view.classList.remove('show');
    }
}