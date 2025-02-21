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
        this.heading.top = new SplitText('#splitLandingTop', { type: 'chars' });
        this.heading.mid = new SplitText('#splitLandingMid', { type: 'chars' });
        this.heading.bottom = new SplitText('#splitLandingBottom', { type: 'chars' });

        this.bottom = new SplitText('#splitLandingBottomBox', { type: 'words' });
        this.btnLabel = new SplitText('#splitLandingBtnLabel', { type: 'words' });
        this.bottomBtn = document.getElementById('landingBtn');

        this.bellBtn = document.getElementById('bellBtn');
        this.bellLabel = document.getElementById('bellLabel');
    }

    setInitialStates()  {
        // HEADING BOX
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


        // BOTTOM BOX
        this.bottom.words.forEach((word) => {
            word.style.opacity = 0;
            word.style.transform = `translate3d(0, 20px, 0)`;
        });
        
        
        // BUTTON
        this.btnLabel.words.forEach((word) => {
            word.style.opacity = 0;
            word.style.transform = `translate3d(0, 15px, 0)`;
        });

        this.bottomBtnInset = 50;
        this.bottomBtn.style.clipPath = `inset(0% ${this.bottomBtnInset}% round 25px)`;


        // NOTIFICATION HEADER (BELL)
        this.bellBtn.style.clipPath = 'inset(50% round 15px)';
        this.bellLabel.style.clipPath = 'xywh(100% 0 100% 100% round 15px 0 15px 15px)';
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
        ///////////////////////////////////////////////////////////////////////
        // HEADING BOX
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


        ///////////////////////////////////////////////////////////////////////
        // BOTTOM BOX
        const bottomBoxDelay = 1.7;
        this.bottom.words.forEach((word, index) => {
            gsap.to(word, {
                duration: 0.7,
                y: 0,
                delay: bottomBoxDelay + (index * 0.075),
                ease: 'power2.out'
            });
        });
        this.bottom.words.forEach((word, index) => {
            gsap.to(word, {
                duration: 1.2,
                opacity: 1,
                delay: bottomBoxDelay + (index * 0.075),
                ease: 'power2.out'
            });
        });

        gsap.to(this, {
            duration: 1.2,
            bottomBtnInset: 0,
            delay: bottomBoxDelay + 0.85,
            ease: 'power2.out',
            onUpdate: () => {
                this.bottomBtn.style.clipPath = `inset(0% ${this.bottomBtnInset}% round 25px)`;
            }
        });
        this.btnLabel.words.forEach((word, index) => {
            gsap.to(word, {
                duration: 0.6,
                y: 0,
                opacity: 1,
                delay: bottomBoxDelay + 1 + (index * 0.005),
                ease: 'power2.out'
            });
        });


        ///////////////////////////////////////////////////////////////////////
        // NOTIFICATION HEADER (BELL)
        const header = 3.5;
        gsap.to(this.bellBtn, {
            duration: 0.5,
            clipPath: 'inset(0% round 15px)',
            delay: header,
            ease: 'power2.out'
        });
        gsap.to(this.bellLabel, {
            duration: 1.2,
            clipPath: 'xywh(0% 0 100% 100% round 15px 0 15px 15px)',
            delay: header + 0.3,
            ease: 'power2.inOut'
        });
    }

    animateOut() {
        console.log('animateOut LandingTransitions')
        // 
    }
}