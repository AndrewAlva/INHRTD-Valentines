import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import BaseTransitions from './BaseTransitions.js'

export default class LandingTransitions extends BaseTransitions {
    constructor() {
        super();
        this.initUI();

        this.addHandlers();
    }

    initUI() {
        this.heading = {};

        this.heading.top = new SplitText('#splitLandingTop', {
            type: 'chars',
        });
        this.heading.mid = new SplitText('#splitLandingMid', {
            type: 'chars',
        });
        this.heading.bottom = new SplitText('#splitLandingBottom', {
            type: 'chars',
        });
    }

    setInitialStates()  {
        this.heading.top.chars.forEach((char, index) => {
            char.style.opacity = 0;
            char.style.transform = `translate3d(${index * 2}px, -5px, 0) rotateX(-90deg)`;
            char.style.transformOrigin = 'top';
        });
        this.heading.mid.chars.forEach((char, index) => {
            char.style.opacity = 0;
            char.style.transform = `translate3d(${index * 2}px, 2px, 0) rotateX(-90deg)`;
            char.style.transformOrigin = 'bottom';
        });
        this.heading.bottom.chars.forEach((char, index) => {
            char.style.opacity = 0;
            char.style.transform = `translate3d(${index * 2}px, 10px, 0) rotateX(-90deg)`;
            char.style.transformOrigin = 'bottom';
        });
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
        console.log('animateIn LandingTransitions')
        //////////////////////////////////////////
        // Mobile Landing
        var topLineDelay = 0.3;
        gsap.from('#splitLandingTop', {
            duration: 1.5,
            scale: 1.75,
            delay: topLineDelay,
            ease: 'power2.out'
        });
        this.heading.top.chars.forEach((char, index) => {
            gsap.to(char, {
                duration: 1,
                opacity: 1,
                x: 0,
                y: 0,
                rotateX: 0,
                delay: topLineDelay + (index * 0.05),
                ease: 'power2.out'
            });
        });
        this.heading.top.chars.forEach((char, index) => {
            gsap.to(char, {
                duration: 2.5,
                opacity: 1,
                delay: topLineDelay + (index * 0.05),
                ease: 'power2.out'
            });
        });



        var midLineDelay = 0.5;
        gsap.from('#splitLandingMid', {
            duration: 1.5,
            scale: 1.75,
            delay: midLineDelay,
            ease: 'power2.out'
        });
        this.heading.mid.chars.forEach((char, index) => {
            gsap.to(char, {
                duration: 1,
                x: 0,
                y: 0,
                rotateX: 0,
                delay: midLineDelay + (index * 0.05),
                ease: 'power2.out'
            });
        });
        this.heading.mid.chars.forEach((char, index) => {
            gsap.to(char, {
                duration: 2.5,
                opacity: 1,
                delay: midLineDelay + (index * 0.05),
                ease: 'power2.out'
            });
        });



        var bottomLineDelay = 0.7;
        gsap.from('#splitLandingBottom', {
            duration: 1.5,
            scale: 1.75,
            delay: bottomLineDelay,
            ease: 'power2.out'
        });
        this.heading.bottom.chars.forEach((char, index) => {
            gsap.to(char, {
                duration: 1,
                x: 0,
                y: 0,
                rotateX: 0,
                delay: bottomLineDelay + (index * 0.05),
                ease: 'power2.out'
            });
        });
        this.heading.bottom.chars.forEach((char, index) => {
            gsap.to(char, {
                duration: 2.5,
                opacity: 1,
                delay: bottomLineDelay + (index * 0.05),
                ease: 'power2.out'
            });
        });
    }

    animateOut() {
        console.log('animateOut LandingTransitions')
        // 
    }
}