import SplitText from '@activetheory/split-text';
import { gsap } from "gsap";
import Experience from '../Experience.js'

export default class SplitManager {
    constructor() {
        this.experience = new Experience();
        this.events = this.experience.events;
        this.appState = this.experience.appState;
        this.UIManager = this.experience.UIManager;

        this.initContainers();
        this.initSplitChars();
        this.addHandlers();
    }

    initContainers() {
        this.splitLanding = {};
    }

    initSplitChars() {
        this.splitLanding.top = new SplitText('#splitLandingTop', {
            type: 'chars',
        });
        this.splitLanding.mid = new SplitText('#splitLandingMid', {
            type: 'chars',
        });
        this.splitLanding.bottom = new SplitText('#splitLandingBottom', {
            type: 'chars',
        });

        console.log(this.splitLanding);
    }

    setInitialStates() {
        this.splitLanding.top.chars.forEach((char, index) => {
            char.style.opacity = 0;
            char.style.transform = `translate3d(${index * 2}px, -5px, 0) rotateX(-90deg)`;
            char.style.transformOrigin = 'top';
        });
        this.splitLanding.mid.chars.forEach((char, index) => {
            char.style.opacity = 0;
            char.style.transform = `translate3d(${index * 2}px, 2px, 0) rotateX(-90deg)`;
            char.style.transformOrigin = 'bottom';
        });
        this.splitLanding.bottom.chars.forEach((char, index) => {
            char.style.opacity = 0;
            char.style.transform = `translate3d(${index * 2}px, 10px, 0) rotateX(-90deg)`;
            char.style.transformOrigin = 'bottom';
        });
    }


    addHandlers() {
        this.events.on('beforeSiteAnimateIn', this.handleBeforeSiteAnimateIn.bind(this));
        this.appState.on('updateLoveName', this.handleLoveName.bind(this));

        this.events.on('viewChanged', this.handleViewChanged.bind(this));
    }

    handleBeforeSiteAnimateIn() {
        this.setInitialStates();
    }

    handleLoveName() {
        // 
    }

    handleViewChanged(view) {
        console.log('split handle', view);
        switch(view) {
            case 0:
                this.animateInLanding();
                break;
        }
    }


    animateInLanding() {
        //////////////////////////////////////////
        // Mobile Landing
        var topLineDelay = 0.3;
        gsap.from('#splitLandingTop', {
            duration: 1.5,
            scale: 1.75,
            delay: topLineDelay,
            ease: 'power2.out'
        });
        this.splitLanding.top.chars.forEach((char, index) => {
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
        this.splitLanding.top.chars.forEach((char, index) => {
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
        this.splitLanding.mid.chars.forEach((char, index) => {
            gsap.to(char, {
                duration: 1,
                x: 0,
                y: 0,
                rotateX: 0,
                delay: midLineDelay + (index * 0.05),
                ease: 'power2.out'
            });
        });
        this.splitLanding.mid.chars.forEach((char, index) => {
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
        this.splitLanding.bottom.chars.forEach((char, index) => {
            gsap.to(char, {
                duration: 1,
                x: 0,
                y: 0,
                rotateX: 0,
                delay: bottomLineDelay + (index * 0.05),
                ease: 'power2.out'
            });
        });
        this.splitLanding.bottom.chars.forEach((char, index) => {
            gsap.to(char, {
                duration: 2.5,
                opacity: 1,
                delay: bottomLineDelay + (index * 0.05),
                ease: 'power2.out'
            });
        });
    }
}